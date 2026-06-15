from __future__ import annotations

import asyncio
from collections import defaultdict, deque
from io import BytesIO
from pathlib import Path
from time import monotonic

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field

from app.config import settings
from app.utils.analysis import build_analysis
from app.utils.pdf import build_pdf_report
from app.utils.reader import UploadValidationError, read_dataframe, validate_upload
from app.utils.supabase_service import SupabaseServiceError, supabase_service

app = FastAPI(
    title="ReportDoctor.pk API",
    description="Upload CSV/Excel files and generate data quality checks, insights, charts, and PDF reports.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Remaining-Credits"],
)

_rate_limit_buckets: dict[str, deque[float]] = defaultdict(deque)


class CreateOrderRequest(BaseModel):
    plan_id: str = Field(min_length=1)


class RejectOrderRequest(BaseModel):
    admin_note: str | None = None


class GrantCreditRequest(BaseModel):
    user_id: str = Field(min_length=1)
    credits: int = Field(ge=1, le=100)


@app.middleware("http")
async def request_timeout_middleware(request, call_next):
    try:
        return await asyncio.wait_for(call_next(request), timeout=settings.request_timeout_seconds)
    except asyncio.TimeoutError:
        return JSONResponse(
            status_code=504,
            content={
                "detail": "This request took too long to process. Please try a smaller file or contact support for a full report."
            },
        )


@app.middleware("http")
async def rate_limit_middleware(request, call_next):
    if request.method == "OPTIONS" or request.url.path == "/health":
        return await call_next(request)

    client = request.client.host if request.client else "unknown"
    now = monotonic()
    bucket = _rate_limit_buckets[client]
    while bucket and now - bucket[0] > settings.rate_limit_window_seconds:
        bucket.popleft()

    if len(bucket) >= settings.rate_limit_requests:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please wait a minute and try again."},
            headers={"Retry-After": str(settings.rate_limit_window_seconds)},
        )

    bucket.append(now)
    return await call_next(request)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ReportDoctor.pk API"}


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    mode: str = Form("General Data"),
    beginner_mode: bool = Form(True),
    unlock_code: str | None = Form(None),
) -> dict:
    contents = await file.read()
    try:
        validate_upload(file.filename or "", contents)
        df = read_dataframe(file.filename or "uploaded-file", contents)
        return build_analysis(
            file_name=file.filename or "uploaded-file",
            df=df,
            mode=mode,
            beginner_mode=beginner_mode,
            is_full_report=is_unlocked(unlock_code),
        )
    except UploadValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not analyze this file. Please check that it is not password-protected or corrupted.",
        ) from exc


@app.post("/report/pdf")
async def report_pdf(
    request: Request,
    file: UploadFile = File(...),
    mode: str = Form("General Data"),
    beginner_mode: bool = Form(True),
    unlock_code: str | None = Form(None),
) -> StreamingResponse:
    legacy_unlock = is_unlocked(unlock_code)
    credit_user = None
    if not legacy_unlock:
        try:
            token = get_bearer_token(request)
            credit_user = supabase_service.get_user(token)
            if supabase_service.available_credits(credit_user["id"]) <= 0:
                raise SupabaseServiceError(402, "No report credits available. Please buy a paid report plan first.")
        except SupabaseServiceError as exc:
            raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc

    contents = await file.read()
    try:
        validate_upload(file.filename or "", contents)
        df = read_dataframe(file.filename or "uploaded-file", contents)
        analysis = build_analysis(
            file_name=file.filename or "uploaded-file",
            df=df,
            mode=mode,
            beginner_mode=beginner_mode,
            is_full_report=True,
        )
        pdf_bytes = build_pdf_report(analysis)
        remaining_credits = None
        if credit_user:
            remaining_credits = supabase_service.consume_credit_and_save_report(
                credit_user,
                filename=file.filename or "uploaded-file",
                mode=mode,
                analysis=analysis,
            )
    except UploadValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except SupabaseServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not generate the PDF report. Please retry with a smaller or cleaner file.",
        ) from exc

    download_name = f"{Path(file.filename or 'report').stem}-reportdoctor-report.pdf"
    headers = {"Content-Disposition": f'attachment; filename="{download_name}"'}
    if remaining_credits is not None:
        headers["X-Remaining-Credits"] = str(remaining_credits)
    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers=headers,
    )


@app.get("/account/summary")
def account_summary(request: Request) -> dict:
    try:
        user = supabase_service.get_user(get_bearer_token(request))
        return supabase_service.account_summary(user)
    except SupabaseServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.post("/orders")
def create_order(payload: CreateOrderRequest, request: Request) -> dict:
    try:
        user = supabase_service.get_user(get_bearer_token(request))
        return {"order": supabase_service.create_order(user, payload.plan_id)}
    except SupabaseServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.get("/orders/{order_id}")
def get_order(order_id: str, request: Request) -> dict:
    try:
        user = supabase_service.get_user(get_bearer_token(request))
        return {"order": supabase_service.get_order_details(user["id"], order_id)}
    except SupabaseServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.post("/orders/{order_id}/sent")
def mark_order_sent(order_id: str, request: Request) -> dict:
    try:
        user = supabase_service.get_user(get_bearer_token(request))
        return {"order": supabase_service.mark_order_sent(user["id"], order_id)}
    except SupabaseServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.get("/admin/summary")
def admin_summary(request: Request) -> dict:
    try:
        supabase_service.require_admin(get_bearer_token(request))
        return supabase_service.admin_summary()
    except SupabaseServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.get("/admin/orders")
def admin_orders(request: Request, status: str | None = None) -> dict:
    try:
        supabase_service.require_admin(get_bearer_token(request))
        return {"orders": supabase_service.admin_orders(status)}
    except SupabaseServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.post("/admin/orders/{order_id}/approve")
def approve_order(order_id: str, request: Request) -> dict:
    try:
        supabase_service.require_admin(get_bearer_token(request))
        return {"order": supabase_service.approve_order(order_id)}
    except SupabaseServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.post("/admin/orders/{order_id}/reject")
def reject_order(order_id: str, payload: RejectOrderRequest, request: Request) -> dict:
    try:
        supabase_service.require_admin(get_bearer_token(request))
        return {"order": supabase_service.reject_order(order_id, payload.admin_note)}
    except SupabaseServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.get("/admin/users")
def admin_users(request: Request) -> dict:
    try:
        supabase_service.require_admin(get_bearer_token(request))
        return {"users": supabase_service.admin_users()}
    except SupabaseServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.post("/admin/users/grant-credit")
def grant_user_credit(payload: GrantCreditRequest, request: Request) -> dict:
    try:
        supabase_service.require_admin(get_bearer_token(request))
        return {"credit": supabase_service.grant_credit(payload.user_id, payload.credits)}
    except SupabaseServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


@app.get("/admin/reports")
def admin_reports(request: Request) -> dict:
    try:
        supabase_service.require_admin(get_bearer_token(request))
        return {"reports": supabase_service.admin_reports()}
    except SupabaseServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.detail) from exc


def is_unlocked(unlock_code: str | None) -> bool:
    return bool(unlock_code) and unlock_code == settings.report_unlock_code


def get_bearer_token(request: Request) -> str:
    authorization = request.headers.get("authorization", "")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise SupabaseServiceError(401, "Please sign in to continue.")
    return token.strip()

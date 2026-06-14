from __future__ import annotations

import asyncio
from collections import defaultdict, deque
from io import BytesIO
from pathlib import Path
from time import monotonic

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from app.config import settings
from app.utils.analysis import build_analysis
from app.utils.pdf import build_pdf_report
from app.utils.reader import UploadValidationError, read_dataframe, validate_upload

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
)

_rate_limit_buckets: dict[str, deque[float]] = defaultdict(deque)


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
    file: UploadFile = File(...),
    mode: str = Form("General Data"),
    beginner_mode: bool = Form(True),
    unlock_code: str | None = Form(None),
) -> StreamingResponse:
    if not is_unlocked(unlock_code):
        raise HTTPException(status_code=403, detail="Full PDF requires a valid paid report unlock code.")

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
    except UploadValidationError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not generate the PDF report. Please retry with a smaller or cleaner file.",
        ) from exc

    download_name = f"{Path(file.filename or 'report').stem}-reportdoctor-report.pdf"
    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{download_name}"'},
    )


def is_unlocked(unlock_code: str | None) -> bool:
    return bool(unlock_code) and unlock_code == settings.report_unlock_code

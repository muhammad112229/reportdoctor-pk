from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

from app.config import settings


class SupabaseServiceError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail
        super().__init__(detail)


class SupabaseService:
    def __init__(self) -> None:
        self.url = settings.supabase_url
        self.service_key = settings.supabase_service_role_key

    @property
    def configured(self) -> bool:
        return bool(self.url and self.service_key)

    def require_configured(self) -> None:
        if not self.configured:
            raise SupabaseServiceError(503, "Supabase service credentials are not configured on the backend.")

    def get_user(self, token: str) -> dict[str, Any]:
        self.require_configured()
        if not token:
            raise SupabaseServiceError(401, "Please sign in to continue.")

        return self._request(
            "GET",
            "/auth/v1/user",
            auth_token=token,
            use_service_auth=False,
        )

    def ensure_profile(self, user: dict[str, Any]) -> dict[str, Any]:
        user_id = user["id"]
        profile = self.fetch_profile(user_id)
        if profile:
            return profile

        metadata = user.get("user_metadata") or {}
        email = user.get("email")
        return self._rest_insert(
            "profiles",
            {
                "id": user_id,
                "full_name": metadata.get("full_name"),
                "email": email,
                "whatsapp": metadata.get("whatsapp"),
                "role": "user",
            },
        )[0]

    def fetch_profile(self, user_id: str) -> dict[str, Any] | None:
        rows = self._rest_get(
            "profiles",
            {
                "id": f"eq.{user_id}",
                "select": "id,full_name,email,whatsapp,role,created_at",
            },
        )
        return rows[0] if rows else None

    def require_admin(self, token: str) -> tuple[dict[str, Any], dict[str, Any]]:
        user = self.get_user(token)
        profile = self.ensure_profile(user)
        if profile.get("role") != "admin":
            raise SupabaseServiceError(403, "Admin access is required.")
        return user, profile

    def get_plan(self, plan_id: str) -> dict[str, Any]:
        rows = self._rest_get(
            "plans",
            {
                "id": f"eq.{plan_id}",
                "active": "eq.true",
                "select": "id,name,price_pkr,description,report_credits,features,active",
            },
        )
        if not rows:
            raise SupabaseServiceError(404, "Selected pricing plan was not found.")
        return rows[0]

    def create_order(self, user: dict[str, Any], plan_id: str) -> dict[str, Any]:
        profile = self.ensure_profile(user)
        plan = self.get_plan(plan_id)
        if int(plan.get("price_pkr") or 0) <= 0:
            raise SupabaseServiceError(400, "Free Scan does not require a payment order.")

        order = self._rest_insert(
            "orders",
            {
                "user_id": user["id"],
                "plan_id": plan["id"],
                "amount_pkr": plan["price_pkr"],
                "payment_method": "easypaisa",
                "payment_number": settings.easypaisa_number,
                "status": "pending",
            },
        )[0]
        order["plan"] = plan
        order["profile"] = profile
        return order

    def get_order_details(self, user_id: str, order_id: str, *, admin: bool = False) -> dict[str, Any]:
        rows = self._rest_get(
            "orders",
            {
                "id": f"eq.{order_id}",
                "select": "*",
            },
        )
        if not rows:
            raise SupabaseServiceError(404, "Order was not found.")
        order = rows[0]
        if not admin and order.get("user_id") != user_id:
            raise SupabaseServiceError(403, "You do not have access to this order.")

        order["plan"] = self.get_plan(order["plan_id"])
        order["profile"] = self.fetch_profile(order["user_id"])
        return order

    def mark_order_sent(self, user_id: str, order_id: str) -> dict[str, Any]:
        order = self.get_order_details(user_id, order_id)
        if order["status"] == "pending":
            updated = self._rest_patch(
                "orders",
                {"id": f"eq.{order_id}"},
                {"status": "sent_on_whatsapp"},
            )[0]
            updated["plan"] = order["plan"]
            updated["profile"] = order["profile"]
            return updated
        return order

    def account_summary(self, user: dict[str, Any]) -> dict[str, Any]:
        profile = self.ensure_profile(user)
        user_id = user["id"]
        orders = self._rest_get("orders", {"user_id": f"eq.{user_id}", "select": "*", "order": "created_at.desc"})
        credits = self._rest_get(
            "report_credits",
            {"user_id": f"eq.{user_id}", "select": "*", "order": "created_at.desc"},
        )
        reports = self._rest_get(
            "reports",
            {"user_id": f"eq.{user_id}", "select": "id,user_id,filename,mode,pdf_unlocked,created_at", "order": "created_at.desc"},
        )
        plans = self._plans_by_id()
        for order in orders:
            order["plan"] = plans.get(order.get("plan_id"))
        available = self.available_credits(user_id, credits=credits)
        return {
            "profile": profile,
            "orders": orders,
            "credits": credits,
            "reports": reports,
            "available_credits": available,
        }

    def available_credits(self, user_id: str, *, credits: list[dict[str, Any]] | None = None) -> int:
        rows = credits
        if rows is None:
            rows = self._rest_get(
                "report_credits",
                {"user_id": f"eq.{user_id}", "status": "eq.active", "select": "credits_total,credits_used,status"},
            )
        return sum(max(0, int(row.get("credits_total") or 0) - int(row.get("credits_used") or 0)) for row in rows if row.get("status") == "active")

    def consume_credit_and_save_report(self, user: dict[str, Any], *, filename: str, mode: str, analysis: dict[str, Any]) -> int:
        self.ensure_profile(user)
        user_id = user["id"]
        credits = self._rest_get(
            "report_credits",
            {"user_id": f"eq.{user_id}", "status": "eq.active", "select": "*", "order": "created_at.asc"},
        )
        available = self.available_credits(user_id, credits=credits)
        if available <= 0:
            raise SupabaseServiceError(402, "No report credits available. Please buy a paid report plan first.")

        selected = next(
            (
                credit
                for credit in credits
                if int(credit.get("credits_total") or 0) > int(credit.get("credits_used") or 0)
            ),
            None,
        )
        if not selected:
            raise SupabaseServiceError(402, "No report credits available. Please buy a paid report plan first.")

        self._rest_patch(
            "report_credits",
            {"id": f"eq.{selected['id']}"},
            {"credits_used": int(selected.get("credits_used") or 0) + 1},
        )
        self._rest_insert(
            "reports",
            {
                "user_id": user_id,
                "filename": filename,
                "mode": mode,
                "pdf_unlocked": True,
                "free_scan_json": compact_report_snapshot(analysis),
            },
        )
        return available - 1

    def admin_summary(self) -> dict[str, Any]:
        orders = self.admin_orders()
        users = self.admin_users()
        reports = self.admin_reports()
        return {
            "orders_total": len(orders),
            "pending_orders": len([order for order in orders if order.get("status") in {"pending", "sent_on_whatsapp"}]),
            "approved_orders": len([order for order in orders if order.get("status") == "approved"]),
            "users_total": len(users),
            "reports_total": len(reports),
        }

    def admin_orders(self, status: str | None = None) -> list[dict[str, Any]]:
        query = {"select": "*", "order": "created_at.desc"}
        if status:
            query["status"] = f"eq.{status}"
        orders = self._rest_get("orders", query)
        profiles = {profile["id"]: profile for profile in self._rest_get("profiles", {"select": "id,full_name,email,whatsapp,role,created_at"})}
        plans = self._plans_by_id()
        for order in orders:
            order["profile"] = profiles.get(order.get("user_id"))
            order["plan"] = plans.get(order.get("plan_id"))
        return orders

    def admin_users(self) -> list[dict[str, Any]]:
        profiles = self._rest_get("profiles", {"select": "id,full_name,email,whatsapp,role,created_at", "order": "created_at.desc"})
        credits = self._rest_get("report_credits", {"select": "user_id,credits_total,credits_used,status"})
        credits_by_user: dict[str, int] = {}
        for credit in credits:
            if credit.get("status") == "active":
                credits_by_user[credit["user_id"]] = credits_by_user.get(credit["user_id"], 0) + max(
                    0,
                    int(credit.get("credits_total") or 0) - int(credit.get("credits_used") or 0),
                )
        for profile in profiles:
            profile["available_credits"] = credits_by_user.get(profile["id"], 0)
        return profiles

    def grant_credit(self, user_id: str, credits: int) -> dict[str, Any]:
        if credits <= 0:
            raise SupabaseServiceError(400, "Credit grant must be at least 1.")

        profile = self.fetch_profile(user_id)
        if not profile:
            raise SupabaseServiceError(404, "User profile was not found.")

        return self._rest_insert(
            "report_credits",
            {
                "user_id": user_id,
                "order_id": None,
                "credits_total": credits,
                "credits_used": 0,
                "status": "active",
            },
        )[0]

    def admin_reports(self) -> list[dict[str, Any]]:
        reports = self._rest_get(
            "reports",
            {"select": "id,user_id,filename,mode,pdf_unlocked,created_at", "order": "created_at.desc"},
        )
        profiles = {profile["id"]: profile for profile in self._rest_get("profiles", {"select": "id,full_name,email,whatsapp,role"})}
        for report in reports:
            user_id = report.get("user_id")
            report["profile"] = profiles.get(user_id) if user_id else None
        return reports

    def approve_order(self, order_id: str) -> dict[str, Any]:
        order = self.get_order_details("", order_id, admin=True)
        if order["status"] == "approved":
            return order
        if order["status"] == "rejected":
            raise SupabaseServiceError(400, "Rejected orders cannot be approved without creating a new order.")

        plan = order["plan"]
        approved = self._rest_patch(
            "orders",
            {"id": f"eq.{order_id}"},
            {"status": "approved", "approved_at": datetime.now(timezone.utc).isoformat()},
        )[0]

        existing_credit = self._rest_get("report_credits", {"order_id": f"eq.{order_id}", "select": "id"})
        if not existing_credit and int(plan.get("report_credits") or 0) > 0:
            self._rest_insert(
                "report_credits",
                {
                    "user_id": order["user_id"],
                    "order_id": order_id,
                    "credits_total": plan["report_credits"],
                    "credits_used": 0,
                    "status": "active",
                },
            )

        approved["plan"] = plan
        approved["profile"] = order["profile"]
        return approved

    def reject_order(self, order_id: str, admin_note: str | None = None) -> dict[str, Any]:
        order = self.get_order_details("", order_id, admin=True)
        if order["status"] == "approved":
            raise SupabaseServiceError(400, "Approved orders cannot be rejected.")
        rejected = self._rest_patch(
            "orders",
            {"id": f"eq.{order_id}"},
            {"status": "rejected", "admin_note": admin_note or ""},
        )[0]
        rejected["plan"] = order["plan"]
        rejected["profile"] = order["profile"]
        return rejected

    def _plans_by_id(self) -> dict[str, dict[str, Any]]:
        return {
            plan["id"]: plan
            for plan in self._rest_get(
                "plans",
                {"select": "id,name,price_pkr,description,report_credits,features,active"},
            )
        }

    def _rest_get(self, table: str, params: dict[str, str]) -> list[dict[str, Any]]:
        data = self._request("GET", f"/rest/v1/{table}?{encode_params(params)}")
        return data if isinstance(data, list) else []

    def _rest_insert(self, table: str, payload: dict[str, Any]) -> list[dict[str, Any]]:
        data = self._request(
            "POST",
            f"/rest/v1/{table}",
            payload=payload,
            prefer="return=representation",
        )
        return data if isinstance(data, list) else []

    def _rest_patch(self, table: str, filters: dict[str, str], payload: dict[str, Any]) -> list[dict[str, Any]]:
        data = self._request(
            "PATCH",
            f"/rest/v1/{table}?{encode_params(filters)}",
            payload=payload,
            prefer="return=representation",
        )
        return data if isinstance(data, list) else []

    def _request(
        self,
        method: str,
        path: str,
        *,
        payload: dict[str, Any] | None = None,
        auth_token: str | None = None,
        use_service_auth: bool = True,
        prefer: str | None = None,
    ) -> Any:
        self.require_configured()
        body = json.dumps(payload).encode("utf-8") if payload is not None else None
        token = self.service_key if use_service_auth else auth_token
        headers = {
            "apikey": self.service_key,
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        }
        if body is not None:
            headers["Content-Type"] = "application/json"
        if prefer:
            headers["Prefer"] = prefer

        request = Request(f"{self.url}{path}", data=body, headers=headers, method=method)
        try:
            with urlopen(request, timeout=20) as response:
                text = response.read().decode("utf-8")
        except HTTPError as exc:
            detail = parse_error_detail(exc)
            raise SupabaseServiceError(exc.code, detail) from exc
        except URLError as exc:
            raise SupabaseServiceError(503, "Supabase service is unavailable. Please try again.") from exc

        return json.loads(text) if text else None


def encode_params(params: dict[str, str]) -> str:
    return "&".join(f"{quote(key, safe='')}={quote(value, safe='*,.:()')}" for key, value in params.items())


def parse_error_detail(exc: HTTPError) -> str:
    try:
        data = json.loads(exc.read().decode("utf-8"))
        if isinstance(data, dict):
            return str(
                data.get("message")
                or data.get("error_description")
                or data.get("error")
                or "Supabase request failed."
            )
    except Exception:
        pass
    return "Supabase request failed."


def compact_report_snapshot(analysis: dict[str, Any]) -> dict[str, Any]:
    return {
        "dataset": analysis.get("dataset"),
        "quality": analysis.get("quality"),
        "metrics": analysis.get("metrics"),
        "insights_en": analysis.get("insights_en"),
        "insights_roman_urdu": analysis.get("insights_roman_urdu"),
        "recommendations": analysis.get("recommendations"),
    }


supabase_service = SupabaseService()

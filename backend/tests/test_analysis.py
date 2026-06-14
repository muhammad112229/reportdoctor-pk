import pandas as pd
import pytest

from app.utils.analysis import build_analysis
from app.config import settings
from app.utils.reader import UploadValidationError, validate_upload


def test_build_sales_analysis_detects_basic_metrics():
    df = pd.DataFrame(
        {
            "order_date": ["2026-01-01", "2026-01-02", "2026-01-02"],
            "order_id": ["A1", "A2", "A3"],
            "product": ["Cable", "Charger", "Cable"],
            "amount": [1000, 2200, 1200],
            "cost": [700, 1500, 800],
        }
    )

    result = build_analysis(
        file_name="sales.csv",
        df=df,
        mode="Sales Data",
        beginner_mode=True,
        is_full_report=False,
    )

    assert result["dataset"]["rows"] == 3
    assert result["quality"]["duplicate_rows"] == 0
    assert any(metric["label"] == "Total sales" for metric in result["metrics"])
    assert len(result["charts"]) <= 2


def test_validate_upload_rejects_unsupported_extension():
    with pytest.raises(UploadValidationError, match="Unsupported file type"):
        validate_upload("payload.exe", b"MZ fake executable")


def test_validate_upload_rejects_bad_xlsx_signature():
    with pytest.raises(UploadValidationError, match="XLSX file appears invalid"):
        validate_upload("fake.xlsx", b"not an excel file")


def test_validate_upload_rejects_empty_file():
    with pytest.raises(UploadValidationError, match="empty"):
        validate_upload("empty.csv", b"")


def test_validate_upload_rejects_large_file(monkeypatch):
    monkeypatch.setattr(settings, "max_upload_mb", 0)
    with pytest.raises(UploadValidationError, match="too large"):
        validate_upload("large.csv", b"column\nvalue\n")

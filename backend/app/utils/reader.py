from __future__ import annotations

from io import BytesIO, StringIO
from pathlib import Path
from zipfile import BadZipFile

import pandas as pd
from pandas.errors import EmptyDataError, ParserError

from app.config import settings

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}


class UploadValidationError(ValueError):
    """Raised when a user-uploaded spreadsheet cannot be safely processed."""


def validate_upload(filename: str, contents: bytes) -> None:
    extension = Path(filename or "").suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
        raise UploadValidationError(f"Unsupported file type. Please upload one of: {allowed}.")
    if not contents:
        raise UploadValidationError("Uploaded file is empty. Please choose a CSV or Excel file with rows and columns.")
    if len(contents) > settings.max_upload_bytes:
        raise UploadValidationError(f"File is too large. Maximum upload size is {settings.max_upload_mb} MB.")
    validate_file_signature(extension, contents)


def validate_file_signature(extension: str, contents: bytes) -> None:
    header = contents[:8]
    if extension == ".xlsx" and not header.startswith(b"PK"):
        raise UploadValidationError("This XLSX file appears invalid or corrupted. Please export it again and retry.")
    if extension == ".xls" and not header.startswith(b"\xd0\xcf\x11\xe0"):
        raise UploadValidationError("This XLS file appears invalid or corrupted. Please save it again as XLSX or CSV.")
    if extension == ".csv":
        sample = contents[:2048]
        if b"\x00" in sample:
            raise UploadValidationError("This CSV file appears to be binary or corrupted. Please upload a plain CSV file.")


def read_dataframe(filename: str, contents: bytes) -> pd.DataFrame:
    extension = Path(filename).suffix.lower()

    try:
        if extension == ".csv":
            df = _read_csv(contents)
        else:
            df = pd.read_excel(BytesIO(contents))
    except EmptyDataError as exc:
        raise UploadValidationError("The uploaded file has no readable rows. Please check the file and try again.") from exc
    except (ParserError, UnicodeDecodeError) as exc:
        raise UploadValidationError("Could not read this CSV file. Please check delimiters, encoding, and headers.") from exc
    except BadZipFile as exc:
        raise UploadValidationError("This Excel file appears corrupted. Please save a fresh XLSX copy and upload again.") from exc
    except ValueError as exc:
        raise UploadValidationError(f"Could not read the file format: {exc}") from exc

    df = df.dropna(axis=0, how="all").dropna(axis=1, how="all")
    if df.empty or df.shape[1] == 0:
        raise UploadValidationError("The uploaded file has no usable rows or columns.")
    if df.shape[1] > settings.max_columns:
        raise UploadValidationError(
            f"This file has {df.shape[1]} columns. The MVP supports up to {settings.max_columns} columns per upload."
        )
    df.columns = _normalize_columns(df.columns)
    return df


def _read_csv(contents: bytes) -> pd.DataFrame:
    for encoding in ("utf-8-sig", "utf-8", "latin1"):
        try:
            text = contents.decode(encoding)
            return pd.read_csv(StringIO(text))
        except UnicodeDecodeError:
            continue
    return pd.read_csv(BytesIO(contents))


def _normalize_columns(columns: pd.Index) -> list[str]:
    normalized: list[str] = []
    seen: dict[str, int] = {}
    for index, column in enumerate(columns, start=1):
        value = str(column).strip() if column is not None else ""
        if not value or value.lower().startswith("unnamed:"):
            value = f"column_{index}"
        if value in seen:
            seen[value] += 1
            value = f"{value}_{seen[value]}"
        else:
            seen[value] = 1
        normalized.append(value)
    return normalized

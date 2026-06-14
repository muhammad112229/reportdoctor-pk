from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd

try:
    from sklearn.decomposition import PCA
    from sklearn.impute import SimpleImputer
    from sklearn.preprocessing import StandardScaler
except Exception:  # pragma: no cover - dependency is installed in production requirements
    PCA = None
    SimpleImputer = None
    StandardScaler = None


@dataclass
class DetectedColumns:
    numeric: list[str]
    categorical: list[str]
    date: list[str]
    text: list[str]
    profiles: list[dict[str, Any]]
    suggested_mappings: dict[str, str | None]


FIELD_PATTERNS = {
    "date": ["date", "created", "month", "day", "timestamp", "time"],
    "amount": ["amount", "total", "sale", "sales", "revenue", "net", "price", "fee", "paid", "payment"],
    "product": ["product", "item", "sku", "service", "course", "medicine", "name"],
    "customer": ["customer", "client", "buyer", "student", "patient", "respondent"],
    "quantity": ["qty", "quantity", "units", "sold", "count"],
    "cost": ["cost", "expense", "cogs", "purchase", "buying"],
    "stock": ["stock", "inventory", "available", "on hand", "balance"],
    "order_id": ["order", "invoice", "bill", "receipt", "transaction", "id"],
    "reorder_level": ["reorder", "minimum", "min stock", "threshold"],
    "category": ["category", "type", "segment", "group"]
}


def build_analysis(
    *,
    file_name: str,
    df: pd.DataFrame,
    mode: str,
    beginner_mode: bool,
    is_full_report: bool,
) -> dict[str, Any]:
    detected = detect_columns(df)
    quality = build_quality(df)
    metrics = build_business_metrics(df, mode, detected.suggested_mappings)
    all_charts = build_charts(df, detected)
    charts = all_charts if is_full_report else all_charts[:2]
    insights_en, insights_roman_urdu = build_insights(df, mode, detected, quality, metrics)

    return {
        "file_name": file_name,
        "mode": mode,
        "is_full_report": is_full_report,
        "dataset": {
            "rows": int(df.shape[0]),
            "columns": int(df.shape[1]),
            "column_names": list(df.columns),
            "sample_rows": json_records(df.head(8)),
        },
        "columns": {
            "numeric": detected.numeric,
            "categorical": detected.categorical,
            "date": detected.date,
            "text": detected.text,
            "profiles": detected.profiles,
            "suggested_mappings": detected.suggested_mappings,
        },
        "quality": quality,
        "metrics": metrics,
        "charts": charts,
        "insights_en": insights_en,
        "insights_roman_urdu": insights_roman_urdu,
        "recommendations": build_recommendations(mode, detected, quality),
        "beginner_guidance": build_beginner_guidance(mode, detected) if beginner_mode else [],
        "locked_features": [] if is_full_report else locked_features(),
    }


def detect_columns(df: pd.DataFrame) -> DetectedColumns:
    numeric: list[str] = []
    categorical: list[str] = []
    date: list[str] = []
    text: list[str] = []
    profiles: list[dict[str, Any]] = []

    for column in df.columns:
        series = df[column]
        missing = int(series.isna().sum())
        missing_percent = safe_round((missing / max(len(series), 1)) * 100)
        unique_count = int(series.nunique(dropna=True))
        detected_type = detect_column_type(series)

        if detected_type == "numeric":
            numeric.append(column)
        elif detected_type == "date":
            date.append(column)
        elif detected_type == "categorical":
            categorical.append(column)
        else:
            text.append(column)

        sample_values = [
            stringify_value(value)
            for value in series.dropna().head(3).tolist()
        ]

        profiles.append(
            {
                "name": column,
                "dtype": str(series.dtype),
                "detected_type": detected_type,
                "missing": missing,
                "missing_percent": missing_percent,
                "unique": unique_count,
                "sample_values": sample_values,
            }
        )

    suggested_mappings = suggest_mappings(df, DetectedColumns(numeric, categorical, date, text, profiles, {}))
    return DetectedColumns(numeric, categorical, date, text, profiles, suggested_mappings)


def detect_column_type(series: pd.Series) -> str:
    if pd.api.types.is_numeric_dtype(series):
        return "numeric"
    if pd.api.types.is_datetime64_any_dtype(series):
        return "date"

    non_empty = series.dropna().astype(str).str.strip()
    non_empty = non_empty[non_empty != ""]
    if non_empty.empty:
        return "text"

    sample = non_empty.head(250)
    parsed_dates = pd.to_datetime(sample, errors="coerce", dayfirst=True, format="mixed")
    if parsed_dates.notna().mean() >= 0.65:
        return "date"

    unique_count = non_empty.nunique()
    average_length = float(non_empty.str.len().mean())
    if unique_count <= max(20, int(len(non_empty) * 0.35)) and average_length <= 60:
        return "categorical"
    return "text"


def suggest_mappings(df: pd.DataFrame, detected: DetectedColumns) -> dict[str, str | None]:
    lowered = {column: normalize_name(column) for column in df.columns}
    suggestions: dict[str, str | None] = {}
    for field, patterns in FIELD_PATTERNS.items():
        match = next((column for column, value in lowered.items() if any(pattern in value for pattern in patterns)), None)
        suggestions[field] = match

    if not suggestions["date"] and detected.date:
        suggestions["date"] = detected.date[0]
    if not suggestions["amount"] and detected.numeric:
        suggestions["amount"] = detected.numeric[0]
    if not suggestions["quantity"] and len(detected.numeric) > 1:
        suggestions["quantity"] = detected.numeric[1]
    if not suggestions["product"] and detected.categorical:
        suggestions["product"] = detected.categorical[0]
    if not suggestions["customer"] and len(detected.categorical) > 1:
        suggestions["customer"] = detected.categorical[1]
    if not suggestions["stock"] and detected.numeric:
        stock_like = [column for column in detected.numeric if "stock" in normalize_name(column) or "inventory" in normalize_name(column)]
        suggestions["stock"] = stock_like[0] if stock_like else suggestions["stock"]

    return suggestions


def build_quality(df: pd.DataFrame) -> dict[str, Any]:
    missing_by_column = []
    for column in df.columns:
        missing = int(df[column].isna().sum())
        missing_by_column.append(
            {
                "column": column,
                "missing": missing,
                "missing_percent": safe_round((missing / max(len(df), 1)) * 100),
            }
        )

    return {
        "duplicate_rows": int(df.duplicated().sum()),
        "missing_total": int(df.isna().sum().sum()),
        "missing_by_column": missing_by_column,
    }


def build_business_metrics(df: pd.DataFrame, mode: str, mappings: dict[str, str | None]) -> list[dict[str, str]]:
    mode_lower = mode.lower()
    if "sales" in mode_lower:
        return sales_metrics(df, mappings)
    if "inventory" in mode_lower:
        return inventory_metrics(df, mappings)
    if "survey" in mode_lower:
        return survey_metrics(df)
    if "expense" in mode_lower:
        return expense_metrics(df, mappings)
    if "customer" in mode_lower:
        return customer_metrics(df, mappings)
    return general_metrics(df)


def general_metrics(df: pd.DataFrame) -> list[dict[str, str]]:
    missing_cells = int(df.isna().sum().sum())
    total_cells = max(int(df.shape[0] * df.shape[1]), 1)
    completeness = 100 - (missing_cells / total_cells * 100)
    metrics = [
        {"label": "Rows", "value": format_number(df.shape[0])},
        {"label": "Columns", "value": format_number(df.shape[1])},
        {"label": "Completeness", "value": f"{safe_round(completeness)}%"},
        {"label": "Duplicates", "value": format_number(df.duplicated().sum())},
    ]

    pca_metric = numeric_variance_metric(df)
    if pca_metric:
        metrics.append(pca_metric)
    return metrics


def sales_metrics(df: pd.DataFrame, mappings: dict[str, str | None]) -> list[dict[str, str]]:
    amount_col = mappings.get("amount")
    order_col = mappings.get("order_id")
    quantity_col = mappings.get("quantity")
    cost_col = mappings.get("cost")

    amount = numeric_series(df, amount_col)
    total_sales = float(amount.sum()) if amount is not None else 0.0
    total_orders = int(df[order_col].nunique()) if order_col in df.columns else int(len(df))
    average_order_value = total_sales / max(total_orders, 1)
    metrics = [
        {"label": "Total sales", "value": currency(total_sales)},
        {"label": "Total orders", "value": format_number(total_orders)},
        {"label": "Average order value", "value": currency(average_order_value)},
    ]

    quantity = numeric_series(df, quantity_col)
    if quantity is not None:
        metrics.append({"label": "Units sold", "value": format_number(quantity.sum())})

    cost = numeric_series(df, cost_col)
    if cost is not None and amount is not None:
        profit = float((amount - cost).sum())
        metrics.append({"label": "Estimated profit", "value": currency(profit)})
    return metrics


def inventory_metrics(df: pd.DataFrame, mappings: dict[str, str | None]) -> list[dict[str, str]]:
    stock = numeric_series(df, mappings.get("stock"))
    price = numeric_series(df, mappings.get("amount"))
    if price is None:
        price = numeric_series(df, mappings.get("cost"))
    reorder = numeric_series(df, mappings.get("reorder_level"))
    total_items = int(len(df))

    if stock is None:
        return [
            {"label": "Total rows", "value": format_number(total_items)},
            {"label": "Stock column", "value": "Not detected"},
        ]

    threshold = reorder if reorder is not None else pd.Series(np.repeat(5, len(stock)), index=stock.index)
    low_stock = int((stock <= threshold).sum())
    high_stock = int((stock >= stock.quantile(0.85)).sum()) if len(stock) else 0
    metrics = [
        {"label": "Total items", "value": format_number(total_items)},
        {"label": "Low stock items", "value": format_number(low_stock)},
        {"label": "High stock items", "value": format_number(high_stock)},
    ]

    if price is not None:
        stock_value = float((stock.fillna(0) * price.fillna(0)).sum())
        metrics.append({"label": "Estimated stock value", "value": currency(stock_value)})
    return metrics


def survey_metrics(df: pd.DataFrame) -> list[dict[str, str]]:
    numeric_cols = [column for column in df.columns if pd.api.types.is_numeric_dtype(df[column])]
    categorical_cols = [
        column
        for column in df.columns
        if not pd.api.types.is_numeric_dtype(df[column]) and df[column].nunique(dropna=True) <= max(20, len(df) * 0.5)
    ]
    metrics = [
        {"label": "Responses", "value": format_number(len(df))},
        {"label": "Questions/columns", "value": format_number(df.shape[1])},
        {"label": "Categorical questions", "value": format_number(len(categorical_cols))},
        {"label": "Numeric questions", "value": format_number(len(numeric_cols))},
    ]
    if numeric_cols:
        metrics.append({"label": f"Average {numeric_cols[0]}", "value": str(safe_round(df[numeric_cols[0]].mean()))})
    return metrics


def expense_metrics(df: pd.DataFrame, mappings: dict[str, str | None]) -> list[dict[str, str]]:
    amount = numeric_series(df, mappings.get("amount"))
    category_col = mappings.get("category")
    metrics = [
        {"label": "Expense rows", "value": format_number(len(df))},
        {"label": "Total expenses", "value": currency(float(amount.sum())) if amount is not None else "Not detected"},
    ]
    if category_col in df.columns:
        metrics.append({"label": "Expense categories", "value": format_number(df[category_col].nunique(dropna=True))})
    return metrics


def customer_metrics(df: pd.DataFrame, mappings: dict[str, str | None]) -> list[dict[str, str]]:
    customer_col = mappings.get("customer")
    amount = numeric_series(df, mappings.get("amount"))
    total_customers = int(df[customer_col].nunique()) if customer_col in df.columns else int(len(df))
    metrics = [{"label": "Customers", "value": format_number(total_customers)}]
    if amount is not None:
        metrics.append({"label": "Total customer value", "value": currency(float(amount.sum()))})
        metrics.append({"label": "Average value", "value": currency(float(amount.mean()))})
    return metrics


def build_charts(df: pd.DataFrame, detected: DetectedColumns) -> list[dict[str, Any]]:
    charts: list[dict[str, Any]] = []
    charts.append(missing_values_chart(df))

    if detected.numeric:
        charts.append(numeric_distribution_chart(df, detected.numeric[0]))

    if detected.categorical:
        charts.append(categorical_count_chart(df, detected.categorical[0]))

    if len(detected.numeric) >= 2:
        charts.append(correlation_heatmap(df, detected.numeric[:8]))

    if detected.date and detected.numeric:
        charts.append(monthly_trend_chart(df, detected.date[0], detected.numeric[0]))

    return charts


def missing_values_chart(df: pd.DataFrame) -> dict[str, Any]:
    missing = df.isna().sum().sort_values(ascending=False).head(15)
    return {
        "id": "missing-values",
        "title": "Missing Values by Column",
        "plotly": {
            "data": [
                {
                    "type": "bar",
                    "x": [str(column) for column in missing.index],
                    "y": [int(value) for value in missing.values],
                    "marker": {"color": "#0f766e"},
                }
            ],
            "layout": {"yaxis": {"title": "Missing cells"}, "xaxis": {"title": "Column"}},
        },
    }


def numeric_distribution_chart(df: pd.DataFrame, column: str) -> dict[str, Any]:
    values = pd.to_numeric(df[column], errors="coerce").dropna().head(5000)
    return {
        "id": f"distribution-{slugify(column)}",
        "title": f"Distribution: {column}",
        "plotly": {
            "data": [{"type": "histogram", "x": values.astype(float).tolist(), "marker": {"color": "#2563eb"}}],
            "layout": {"xaxis": {"title": column}, "yaxis": {"title": "Rows"}},
        },
    }


def categorical_count_chart(df: pd.DataFrame, column: str) -> dict[str, Any]:
    counts = df[column].astype(str).replace("nan", "Missing").value_counts().head(12)
    return {
        "id": f"count-{slugify(column)}",
        "title": f"Top Values: {column}",
        "plotly": {
            "data": [
                {
                    "type": "bar",
                    "x": [str(value)[:38] for value in counts.index],
                    "y": [int(value) for value in counts.values],
                    "marker": {"color": "#b45309"},
                }
            ],
            "layout": {"yaxis": {"title": "Count"}, "xaxis": {"title": column}},
        },
    }


def correlation_heatmap(df: pd.DataFrame, columns: list[str]) -> dict[str, Any]:
    corr = df[columns].apply(pd.to_numeric, errors="coerce").corr().fillna(0)
    return {
        "id": "correlation-heatmap",
        "title": "Correlation Heatmap",
        "plotly": {
            "data": [
                {
                    "type": "heatmap",
                    "x": columns,
                    "y": columns,
                    "z": corr.round(2).values.tolist(),
                    "colorscale": "Teal",
                }
            ],
            "layout": {},
        },
    }


def monthly_trend_chart(df: pd.DataFrame, date_column: str, value_column: str) -> dict[str, Any]:
    working = df[[date_column, value_column]].copy()
    working[date_column] = pd.to_datetime(working[date_column], errors="coerce", dayfirst=True)
    working[value_column] = pd.to_numeric(working[value_column], errors="coerce")
    grouped = (
        working.dropna()
        .assign(month=lambda frame: frame[date_column].dt.to_period("M").astype(str))
        .groupby("month", as_index=False)[value_column]
        .sum()
        .tail(18)
    )
    return {
        "id": "monthly-trend",
        "title": f"Monthly Trend: {value_column}",
        "plotly": {
            "data": [
                {
                    "type": "scatter",
                    "mode": "lines+markers",
                    "x": grouped["month"].tolist(),
                    "y": grouped[value_column].round(2).tolist(),
                    "line": {"color": "#be123c", "width": 3},
                }
            ],
            "layout": {"xaxis": {"title": "Month"}, "yaxis": {"title": value_column}},
        },
    }


def build_insights(
    df: pd.DataFrame,
    mode: str,
    detected: DetectedColumns,
    quality: dict[str, Any],
    metrics: list[dict[str, str]],
) -> tuple[list[str], list[str]]:
    missing_total = quality["missing_total"]
    duplicate_rows = quality["duplicate_rows"]
    english = [
        f"The file contains {format_number(df.shape[0])} rows and {format_number(df.shape[1])} columns.",
        f"Detected {len(detected.numeric)} numeric, {len(detected.categorical)} categorical, {len(detected.date)} date, and {len(detected.text)} text columns.",
    ]
    roman = [
        f"Is file mein {format_number(df.shape[0])} rows aur {format_number(df.shape[1])} columns hain.",
        f"System ne {len(detected.numeric)} numeric, {len(detected.categorical)} category, {len(detected.date)} date, aur {len(detected.text)} text columns detect kiye.",
    ]

    if missing_total:
        english.append(f"There are {format_number(missing_total)} missing cells. Review blank values before final decisions.")
        roman.append(f"{format_number(missing_total)} cells blank hain. Final decision se pehle missing values check karein.")
    else:
        english.append("No missing cells were found in this scan.")
        roman.append("Is scan mein missing cells nahi mile.")

    if duplicate_rows:
        english.append(f"{format_number(duplicate_rows)} duplicate rows may be inflating totals or counts.")
        roman.append(f"{format_number(duplicate_rows)} duplicate rows totals ya counts ko zyada dikha sakti hain.")
    else:
        english.append("No exact duplicate rows were found.")
        roman.append("Exact duplicate rows nahi milin.")

    if metrics:
        main_metric = metrics[0]
        english.append(f"For {mode}, the first key metric is {main_metric['label']}: {main_metric['value']}.")
        roman.append(f"{mode} ke liye pehla key metric {main_metric['label']} hai: {main_metric['value']}.")

    product_col = detected.suggested_mappings.get("product")
    amount_col = detected.suggested_mappings.get("amount")
    if product_col in df.columns and amount_col in df.columns:
        top = top_group_value(df, product_col, amount_col)
        if top:
            english.append(f"Top {product_col} by {amount_col} is {top[0]} with {currency(top[1])}.")
            roman.append(f"{amount_col} ke hisaab se top {product_col} {top[0]} hai, total {currency(top[1])}.")

    return english, roman


def build_recommendations(mode: str, detected: DetectedColumns, quality: dict[str, Any]) -> list[str]:
    recommendations = [
        "Keep one clean header row and avoid merged cells before uploading.",
        "Review missing values and duplicates before using totals in business decisions.",
    ]
    if "sales" in mode.lower():
        recommendations.extend(
            [
                "Add date, order ID, product, customer, quantity, amount, and cost columns for a stronger sales report.",
                "Check slow products monthly and compare them with inventory levels before reordering.",
            ]
        )
    elif "inventory" in mode.lower():
        recommendations.extend(
            [
                "Maintain stock and reorder level columns so low-stock items can be flagged correctly.",
                "Add cost or price columns to estimate total stock value.",
            ]
        )
    elif "survey" in mode.lower():
        recommendations.extend(
            [
                "Use consistent answer choices for categorical questions.",
                "Review open-ended text answers separately for themes and quotes.",
            ]
        )
    else:
        recommendations.append("Use a downloadable template if your current file has unclear column names.")

    if quality["missing_total"]:
        recommendations.append("Fill or label important blank cells such as amount, date, product, or customer before final PDF sharing.")
    if not detected.date:
        recommendations.append("Add a date column if you want monthly or weekly trend charts.")
    return recommendations


def build_beginner_guidance(mode: str, detected: DetectedColumns) -> list[str]:
    guidance = [
        "Step 1: Confirm the file type. Sales, inventory, survey, expense, and customer files need different key columns.",
        "Step 2: Review suggested mappings. Agar column galat detect hua hai, file mein column name clear karein.",
        "Step 3: Check blank cells and duplicate rows before trusting totals.",
    ]
    required_by_mode = {
        "sales": ["date", "amount", "product", "quantity"],
        "inventory": ["product", "stock"],
        "survey": [],
        "expense": ["date", "amount", "category"],
        "customer": ["customer"],
    }
    mode_key = next((key for key in required_by_mode if key in mode.lower()), "general")
    for field in required_by_mode.get(mode_key, []):
        if not detected.suggested_mappings.get(field):
            guidance.append(f"Missing suggestion: {field}. Is field ke liye column add ya rename karein.")
    return guidance


def locked_features() -> list[str]:
    return [
        "All available charts instead of the first two",
        "Full PDF report with cover page, data quality section, insights, recommendations, and disclaimer",
        "Business-mode details for sales, inventory, expenses, customers, or surveys",
        "Manual review workflow after JazzCash, Easypaisa, or bank transfer payment",
    ]


def numeric_variance_metric(df: pd.DataFrame) -> dict[str, str] | None:
    if PCA is None or SimpleImputer is None or StandardScaler is None:
        return None
    numeric_df = df.select_dtypes(include=[np.number]).copy()
    if numeric_df.shape[1] < 2 or numeric_df.shape[0] < 5:
        return None
    try:
        imputed = SimpleImputer(strategy="median").fit_transform(numeric_df)
        scaled = StandardScaler().fit_transform(imputed)
        pca = PCA(n_components=1).fit(scaled)
        explained = float(pca.explained_variance_ratio_[0] * 100)
        return {"label": "Main numeric pattern", "value": f"{safe_round(explained)}%"}
    except Exception:
        return None


def numeric_series(df: pd.DataFrame, column: str | None) -> pd.Series | None:
    if not column or column not in df.columns:
        return None
    series = pd.to_numeric(df[column], errors="coerce")
    if series.notna().sum() == 0:
        return None
    return series.fillna(0)


def top_group_value(df: pd.DataFrame, group_col: str, value_col: str) -> tuple[str, float] | None:
    values = pd.to_numeric(df[value_col], errors="coerce")
    if values.notna().sum() == 0:
        return None
    grouped = df.assign(_value=values).dropna(subset=["_value"]).groupby(group_col)["_value"].sum().sort_values(ascending=False)
    if grouped.empty:
        return None
    return str(grouped.index[0]), float(grouped.iloc[0])


def json_records(df: pd.DataFrame) -> list[dict[str, Any]]:
    records = df.replace({np.nan: None}).to_dict(orient="records")
    return [{str(key): json_value(value) for key, value in row.items()} for row in records]


def json_value(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        return None if np.isnan(value) else float(value)
    if isinstance(value, (pd.Timestamp,)):
        return value.isoformat()
    return value


def stringify_value(value: Any) -> str:
    converted = json_value(value)
    if converted is None:
        return ""
    return str(converted)[:60]


def normalize_name(value: str) -> str:
    return str(value).strip().lower().replace("_", " ").replace("-", " ")


def safe_round(value: float, digits: int = 2) -> float:
    if pd.isna(value):
        return 0.0
    return round(float(value), digits)


def format_number(value: Any) -> str:
    try:
        number = float(value)
    except Exception:
        return str(value)
    if number.is_integer():
        return f"{int(number):,}"
    return f"{number:,.2f}"


def currency(value: float) -> str:
    return f"Rs. {value:,.0f}"


def slugify(value: str) -> str:
    return "".join(character.lower() if character.isalnum() else "-" for character in value).strip("-")

from __future__ import annotations

from typing import Any


def build_consultant_report(
    *,
    dataset: dict[str, Any],
    quality: dict[str, Any],
    metrics: list[dict[str, str]],
    diagnosis: dict[str, Any],
    business_health: dict[str, Any] | None,
    recommendations: list[str],
    chart_explanations: list[dict[str, str]],
) -> dict[str, Any]:
    """Rule-based consultant narrative for the premium AI-style report."""

    rows = dataset.get("rows", 0)
    columns = dataset.get("columns", 0)
    health_score = diagnosis.get("score", 0)
    business_score = business_health.get("score") if business_health else None
    headline_metric = metrics[0] if metrics else None

    executive_summary = [
        f"Reviewed {rows:,} rows across {columns:,} columns for reporting readiness.",
        f"Data Health Score is {health_score}/100 with {str(diagnosis.get('severity', 'Moderate')).lower()} overall quality.",
    ]
    if headline_metric:
        executive_summary.append(f"Primary KPI: {headline_metric['label']} is {headline_metric['value']}.")
    if business_score is not None:
        executive_summary.append(f"Business Health Score is {business_score}/100 based on available commercial signals.")

    key_findings = [
        diagnosis.get("summary", "Dataset structure is readable and ready for basic analysis."),
        *[f"{metric['label']}: {metric['value']}" for metric in metrics[:4]],
    ]

    risks = list(diagnosis.get("risks", []))
    if business_health:
        risks.extend(business_health.get("main_risks", [])[:3])
    if not risks:
        risks.append("No major data or business risk was detected from the available columns.")

    opportunities = business_health.get("opportunities", []) if business_health else []
    if not opportunities:
        opportunities = [
            "Add clearer date, amount, product/category, and customer columns to unlock stronger trend and segmentation analysis.",
            "Use consistent templates every month so performance can be compared over time.",
        ]

    actions = list(business_health.get("recommended_actions", []) if business_health else [])
    actions.extend(recommendations[:4])
    actions = dedupe(actions)[:7]

    return {
        "executive_summary": executive_summary,
        "key_findings": dedupe(key_findings)[:7],
        "risks": dedupe(risks)[:7],
        "opportunities": dedupe(opportunities)[:6],
        "recommended_actions": actions,
        "data_quality_notes": diagnosis.get("prescription", []),
        "chart_explanations": chart_explanations,
        "simple_language_summary": simple_language_summary(diagnosis, business_health, headline_metric),
        "next_30_day_action_plan": next_30_day_plan(actions, diagnosis),
    }


def simple_language_summary(
    diagnosis: dict[str, Any],
    business_health: dict[str, Any] | None,
    headline_metric: dict[str, str] | None,
) -> str:
    parts = [
        f"Your file is rated {diagnosis.get('severity', 'Moderate')} for data quality.",
        diagnosis.get("impact", "It can be used for basic reporting, but important issues should be reviewed first."),
    ]
    if headline_metric:
        parts.append(f"The main number to watch is {headline_metric['label']}: {headline_metric['value']}.")
    if business_health:
        parts.append(business_health.get("explanation", "Business signals were reviewed where columns were available."))
    return " ".join(parts)


def next_30_day_plan(actions: list[str], diagnosis: dict[str, Any]) -> list[str]:
    plan = [
        "Week 1: Clean missing values, duplicate rows, and inconsistent labels in the source spreadsheet.",
        "Week 2: Standardize date, amount, product/category, customer, stock, and cost columns for repeat reporting.",
    ]
    if actions:
        plan.append(f"Week 3: Act on the highest priority recommendation: {actions[0]}")
    else:
        plan.append("Week 3: Review the strongest KPIs with the business owner or team lead.")
    plan.append("Week 4: Re-upload the cleaned file and compare the new scores against this baseline.")
    if diagnosis.get("score", 100) < 70:
        plan.insert(1, "Immediate: Fix critical data quality issues before sharing the report with clients or decision makers.")
    return plan[:5]


def dedupe(items: list[str]) -> list[str]:
    seen: set[str] = set()
    cleaned: list[str] = []
    for item in items:
        text = str(item).strip()
        if text and text not in seen:
            seen.add(text)
            cleaned.append(text)
    return cleaned

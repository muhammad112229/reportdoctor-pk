from __future__ import annotations

from io import BytesIO
from typing import Any

from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.shapes import Drawing, String
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def build_pdf_report(analysis: dict[str, Any]) -> bytes:
    buffer = BytesIO()
    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=42,
        leftMargin=42,
        topMargin=42,
        bottomMargin=42,
        title=f"{analysis['file_name']} ReportDoctor.pk Report",
    )
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="BrandTitle", parent=styles["Title"], fontSize=26, leading=32, textColor=colors.HexColor("#0f766e")))
    styles.add(ParagraphStyle(name="CoverTitle", parent=styles["Title"], fontSize=32, leading=38, textColor=colors.HexColor("#102033")))
    styles.add(ParagraphStyle(name="SectionIntro", parent=styles["BodyText"], fontSize=11, leading=16, textColor=colors.HexColor("#334155")))
    styles.add(ParagraphStyle(name="SmallMuted", parent=styles["BodyText"], fontSize=9, leading=13, textColor=colors.HexColor("#5b6774")))

    story: list[Any] = []
    story.append(Paragraph("ReportDoctor.pk", styles["BrandTitle"]))
    story.append(Paragraph("AI Data Consultant Report", styles["CoverTitle"]))
    story.append(Paragraph("Consultant-grade Excel/CSV analysis with data diagnosis, business health, KPIs, risks, opportunities, and action plan.", styles["SectionIntro"]))
    story.append(Spacer(1, 0.3 * inch))
    cover_rows = [
        ["Report for", analysis["file_name"]],
        ["Mode", analysis["mode"]],
        ["Data Health Score", f"{analysis.get('data_doctor_diagnosis', {}).get('score', 'N/A')}/100"],
        ["Business Health Score", business_score_label(analysis.get("business_health_score"))],
    ]
    story.append(styled_table(cover_rows, ["Field", "Value"]))
    story.append(Spacer(1, 0.25 * inch))
    story.append(Paragraph("Generated automatically by rule-based analysis. Review before business, legal, accounting, medical, or financial decisions.", styles["SmallMuted"]))
    story.append(PageBreak())

    consultant = analysis.get("consultant_report", {})
    if consultant:
        add_section_title(story, styles, "Executive Summary")
        for item in consultant.get("executive_summary", []):
            story.append(Paragraph(f"- {item}", styles["BodyText"]))
        story.append(Spacer(1, 0.16 * inch))

    add_section_title(story, styles, "KPI Summary")
    dataset = analysis["dataset"]
    summary_rows = [
        ["Rows", f"{dataset['rows']:,}"],
        ["Columns", f"{dataset['columns']:,}"],
        ["Missing cells", f"{analysis['quality']['missing_total']:,}"],
        ["Duplicate rows", f"{analysis['quality']['duplicate_rows']:,}"],
    ]
    story.append(styled_table(summary_rows, ["Metric", "Value"]))
    story.append(Spacer(1, 0.18 * inch))

    if analysis["metrics"]:
        add_section_title(story, styles, "Business Metrics")
        story.append(styled_table([[metric["label"], metric["value"]] for metric in analysis["metrics"]], ["Metric", "Value"]))
        story.append(Spacer(1, 0.18 * inch))

    diagnosis = analysis.get("data_doctor_diagnosis")
    if diagnosis:
        add_section_title(story, styles, "Data Doctor Diagnosis")
        diagnosis_rows = [
            ["Score", f"{diagnosis.get('score')}/100"],
            ["Severity", str(diagnosis.get("severity"))],
            ["Diagnosis", str(diagnosis.get("diagnosis"))],
            ["Risk", str(diagnosis.get("risk"))],
            ["Impact", str(diagnosis.get("impact"))],
        ]
        story.append(styled_table(diagnosis_rows, ["Diagnosis Field", "Detail"]))
        story.append(Spacer(1, 0.12 * inch))
        add_section_title(story, styles, "Prescription")
        for item in diagnosis.get("prescription", []):
            story.append(Paragraph(f"- {item}", styles["BodyText"]))
        story.append(Spacer(1, 0.18 * inch))

    business_health = analysis.get("business_health_score")
    if business_health:
        add_section_title(story, styles, "Business Health Score")
        story.append(
            styled_table(
                [
                    ["Score", business_score_label(business_health)],
                    ["Grade", str(business_health.get("grade"))],
                    ["Mode", str(business_health.get("mode"))],
                    ["Explanation", str(business_health.get("explanation"))],
                ],
                ["Field", "Value"],
            )
        )
        story.append(Spacer(1, 0.12 * inch))

    add_section_title(story, styles, "Data Quality Check")
    missing_rows = [
        [item["column"], f"{item['missing']:,}", f"{item['missing_percent']}%"]
        for item in analysis["quality"]["missing_by_column"][:12]
    ]
    story.append(styled_table(missing_rows, ["Column", "Missing", "Missing %"]))
    story.append(Spacer(1, 0.2 * inch))

    chart = missing_chart(analysis["quality"]["missing_by_column"][:10])
    if chart:
        story.append(chart)
        story.append(Spacer(1, 0.2 * inch))

    if consultant:
        add_section_title(story, styles, "Key Findings")
        for item in consultant.get("key_findings", []):
            story.append(Paragraph(f"- {item}", styles["BodyText"]))
        story.append(Spacer(1, 0.12 * inch))

        add_section_title(story, styles, "Risks")
        for item in consultant.get("risks", []):
            story.append(Paragraph(f"- {item}", styles["BodyText"]))
        story.append(Spacer(1, 0.12 * inch))

        add_section_title(story, styles, "Opportunities")
        for item in consultant.get("opportunities", []):
            story.append(Paragraph(f"- {item}", styles["BodyText"]))
        story.append(Spacer(1, 0.12 * inch))

        add_section_title(story, styles, "Chart Insights")
        for item in consultant.get("chart_explanations", []):
            story.append(Paragraph(f"- {item.get('title')}: {item.get('reason')}", styles["BodyText"]))
        story.append(Spacer(1, 0.12 * inch))

    add_section_title(story, styles, "Insights")
    for insight in analysis["insights_en"]:
        story.append(Paragraph(f"- {insight}", styles["BodyText"]))
    story.append(Spacer(1, 0.12 * inch))

    add_section_title(story, styles, "Recommendations")
    recommended_actions = consultant.get("recommended_actions", []) if consultant else analysis["recommendations"]
    for recommendation in recommended_actions:
        story.append(Paragraph(f"- {recommendation}", styles["BodyText"]))
    story.append(Spacer(1, 0.2 * inch))

    if consultant:
        add_section_title(story, styles, "Next 30-Day Action Plan")
        for item in consultant.get("next_30_day_action_plan", []):
            story.append(Paragraph(f"- {item}", styles["BodyText"]))
        story.append(Spacer(1, 0.2 * inch))

    add_section_title(story, styles, "Simple Guidance Summary")
    for insight in analysis["insights_roman_urdu"]:
        story.append(Paragraph(f"- {insight}", styles["BodyText"]))
    story.append(Spacer(1, 0.18 * inch))

    add_section_title(story, styles, "Disclaimer")
    story.append(
        Paragraph(
            "Generated reports are informational and should be reviewed before business, legal, accounting, medical, or financial decisions.",
            styles["SmallMuted"],
        )
    )

    document.build(story)
    return buffer.getvalue()


def business_score_label(value: dict[str, Any] | None) -> str:
    if not value or value.get("score") is None:
        return "Not enough business signals"
    return f"{value.get('score')}/100 ({value.get('grade')})"


def add_section_title(story: list[Any], styles: Any, title: str) -> None:
    story.append(Paragraph(title, styles["Heading2"]))
    story.append(Spacer(1, 0.08 * inch))


def styled_table(rows: list[list[str]], headers: list[str]) -> Table:
    table = Table([headers, *rows], hAlign="LEFT", repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e9f7f5")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#17212b")),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#d9e3ea")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fbfc")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def missing_chart(items: list[dict[str, Any]]) -> Drawing | None:
    if not items:
        return None
    labels = [str(item["column"])[:12] for item in items]
    values = [float(item["missing"]) for item in items]
    drawing = Drawing(470, 230)
    drawing.add(String(20, 210, "Missing values chart", fontSize=11, fillColor=colors.HexColor("#17212b")))
    chart = VerticalBarChart()
    chart.x = 35
    chart.y = 35
    chart.height = 150
    chart.width = 400
    chart.data = [values]
    chart.categoryAxis.categoryNames = labels
    chart.valueAxis.valueMin = 0
    chart.barWidth = 12
    chart.barSpacing = 4
    chart.bars[0].fillColor = colors.HexColor("#0f766e")
    chart.categoryAxis.labels.angle = 35
    chart.categoryAxis.labels.fontSize = 7
    drawing.add(chart)
    return drawing

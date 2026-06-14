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
    styles.add(ParagraphStyle(name="SmallMuted", parent=styles["BodyText"], fontSize=9, leading=13, textColor=colors.HexColor("#5b6774")))

    story: list[Any] = []
    story.append(Paragraph("ReportDoctor.pk", styles["BrandTitle"]))
    story.append(Paragraph("Excel/CSV file upload karein, professional report hasil karein.", styles["Heading2"]))
    story.append(Spacer(1, 0.35 * inch))
    story.append(Paragraph(f"Report for: {analysis['file_name']}", styles["Heading1"]))
    story.append(Paragraph(f"Mode: {analysis['mode']}", styles["BodyText"]))
    story.append(Spacer(1, 0.25 * inch))
    story.append(Paragraph("This report is generated automatically from the uploaded file and should be reviewed by the user.", styles["SmallMuted"]))
    story.append(PageBreak())

    add_section_title(story, styles, "Dataset Summary")
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

    add_section_title(story, styles, "Insights")
    for insight in analysis["insights_en"]:
        story.append(Paragraph(f"- {insight}", styles["BodyText"]))
    story.append(Spacer(1, 0.12 * inch))
    add_section_title(story, styles, "Roman Urdu Insights")
    for insight in analysis["insights_roman_urdu"]:
        story.append(Paragraph(f"- {insight}", styles["BodyText"]))
    story.append(Spacer(1, 0.18 * inch))

    add_section_title(story, styles, "Recommendations")
    for recommendation in analysis["recommendations"]:
        story.append(Paragraph(f"- {recommendation}", styles["BodyText"]))
    story.append(Spacer(1, 0.2 * inch))

    add_section_title(story, styles, "Disclaimer")
    story.append(
        Paragraph(
            "Generated reports are informational and should be reviewed before business, legal, accounting, medical, or financial decisions.",
            styles["SmallMuted"],
        )
    )

    document.build(story)
    return buffer.getvalue()


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


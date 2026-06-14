from __future__ import annotations

from pathlib import Path


REPORTS = [
    (
        "mobile-shop-sales-report.pdf",
        "Mobile Shop Sales Report",
        [
            "Total sales: Rs. 38,600",
            "Top product: Fast Charger",
            "Data quality: 0 duplicate rows, 0 missing amount cells",
            "Recommendation: review low-stock accessories before next purchase",
        ],
    ),
    (
        "daraz-seller-sales-report.pdf",
        "Daraz Seller Sales Report",
        [
            "Total sales: Rs. 27,400",
            "Top SKU: USB-C Cable",
            "Trend: March and April exports show stronger repeat orders",
            "Recommendation: compare product cost and platform fees before discounting",
        ],
    ),
    (
        "tuition-academy-fee-report.pdf",
        "Tuition Academy Fee Report",
        [
            "Collected fees: Rs. 185,000",
            "Outstanding dues: Rs. 32,000",
            "Top class: Grade 9 Evening Batch",
            "Recommendation: follow up with students whose dues are older than 30 days",
        ],
    ),
    (
        "clinic-patient-report.pdf",
        "Clinic Patient Report",
        [
            "Patient visits: 420",
            "Top service: Consultation",
            "Trend: weekend visits are higher than weekdays",
            "Recommendation: review waiting time and appointment capacity",
        ],
    ),
    (
        "inventory-report.pdf",
        "Inventory Report",
        [
            "Total items: 8",
            "Low stock items: 3",
            "Estimated stock value: Rs. 396,400",
            "Recommendation: reorder Screen Protector and Bluetooth Earbuds first",
        ],
    ),
]


def pdf_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_pdf(title: str, lines: list[str]) -> bytes:
    text_commands = [
        "BT",
        "/F1 24 Tf",
        "72 770 Td",
        f"({pdf_escape('ReportDoctor.pk')}) Tj",
        "0 -34 Td",
        "/F1 18 Tf",
        f"({pdf_escape(title)}) Tj",
        "0 -34 Td",
        "/F1 11 Tf",
        f"({pdf_escape('Sample PDF generated for the MVP website.')}) Tj",
    ]
    for line in lines:
        text_commands.extend(["0 -22 Td", f"({pdf_escape('- ' + line)}) Tj"])
    text_commands.extend(
        [
            "0 -34 Td",
            f"({pdf_escape('Disclaimer: informational sample only; review real uploaded data before decisions.')}) Tj",
            "ET",
        ]
    )
    stream = "\n".join(text_commands).encode("latin1")

    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
        b"<< /Length " + str(len(stream)).encode("ascii") + b" >>\nstream\n" + stream + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]

    output = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0]
    for index, obj in enumerate(objects, start=1):
        offsets.append(len(output))
        output.extend(f"{index} 0 obj\n".encode("ascii"))
        output.extend(obj)
        output.extend(b"\nendobj\n")

    xref_at = len(output)
    output.extend(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
    output.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        output.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    output.extend(
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_at}\n%%EOF\n".encode("ascii")
    )
    return bytes(output)


def main() -> None:
    targets = [Path("sample_reports"), Path("frontend/public/sample-reports")]
    for target in targets:
        target.mkdir(parents=True, exist_ok=True)
    for filename, title, lines in REPORTS:
        data = build_pdf(title, lines)
        for target in targets:
            (target / filename).write_bytes(data)


if __name__ == "__main__":
    main()


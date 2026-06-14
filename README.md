# ReportDoctor.pk

ReportDoctor.pk is a production-oriented MVP website and data-analysis app for Pakistani spreadsheet users.

Tagline: **Excel/CSV file upload karein, professional report hasil karein.**

It includes a Next.js SEO website, a FastAPI analysis backend, CSV/XLS/XLSX upload, data quality checks, charts, English and Roman Urdu insights, and PDF report generation with a manual paid-unlock workflow.

## Project Structure

```text
frontend/          Next.js App Router website and upload UI
backend/           FastAPI API, analysis utilities, PDF generation
sample_data/       CSV/XLSX files for testing
sample_reports/    Starter PDF examples
scripts/           Sample report generation helpers
```

## Environment Variables

Copy examples before running locally:

```powershell
Copy-Item frontend\.env.example frontend\.env.local
Copy-Item backend\.env.example backend\.env
```

Important frontend values:

```text
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SITE_URL=https://reportdoctor.pk
NEXT_PUBLIC_CONTACT_EMAIL=hello@reportdoctor.pk
NEXT_PUBLIC_JAZZCASH_NUMBER=03XX-XXXXXXX
NEXT_PUBLIC_EASYPAISA_NUMBER=03XX-XXXXXXX
NEXT_PUBLIC_BANK_DETAILS=Bank name / account title / IBAN
NEXT_PUBLIC_WHATSAPP_NUMBER=923000000000
```

Important backend values:

```text
FRONTEND_ORIGINS=http://127.0.0.1:3000,http://localhost:3000
MAX_UPLOAD_MB=10
MAX_COLUMNS=200
REQUEST_TIMEOUT_SECONDS=60
RATE_LIMIT_REQUESTS=60
RATE_LIMIT_WINDOW_SECONDS=60
PAID_UNLOCK_CODE=demo123
```

Do not commit real secret values. `.gitignore` excludes local env files.

## Local Backend

```powershell
cd "e:\website project\backend"
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Production start command:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```

## Local Frontend

```powershell
cd "e:\website project\frontend"
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Production Build

Frontend:

```powershell
cd frontend
& "C:\Program Files\nodejs\npm.cmd" run build
```

Backend tests:

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest
```

Browser smoke test:

```powershell
cd frontend
node e2e-smoke.mjs
```

## Backend Hardening

- Uploads are processed in memory; files are not written to disk by default.
- Allowed extensions: `.csv`, `.xlsx`, `.xls`.
- Basic file-signature checks reject disguised binaries and corrupted Excel files.
- Default upload limit: 10 MB.
- Default maximum columns: 200.
- User-friendly errors cover large, empty, unsupported, invalid, and corrupted files.
- Simple in-memory rate limiting is included for MVP traffic.
- Request timeout middleware returns a 504 for long-running uploads.

For serious public traffic, add proxy-level rate limiting, request body limits, malware scanning, structured logs, and real payment/order tracking.

## Monetization Setup

Pricing is editable in `frontend/lib/site.ts` under `pricingTiers`.

Manual payment placeholders are configured through:

```text
NEXT_PUBLIC_JAZZCASH_NUMBER
NEXT_PUBLIC_EASYPAISA_NUMBER
NEXT_PUBLIC_BANK_DETAILS
NEXT_PUBLIC_WHATSAPP_NUMBER
PAID_UNLOCK_CODE
```

The MVP flow is manual:

1. User runs a free scan.
2. User requests full report.
3. User pays through JazzCash, Easypaisa, or bank transfer.
4. Admin verifies payment and gives an unlock code.
5. User enters unlock code and downloads the PDF.

## Troubleshooting

- **Frontend cannot reach backend:** confirm `NEXT_PUBLIC_API_URL` and backend CORS `FRONTEND_ORIGINS`.
- **PowerShell blocks npm:** use `npm.cmd` instead of `npm`.
- **PDF download says unlock required:** confirm `PAID_UNLOCK_CODE` matches the code entered in the UI.
- **Upload rejected:** confirm file extension, file size under `MAX_UPLOAD_MB`, and that the file is not corrupted or password-protected.
- **CORS error in browser:** add the exact frontend origin, including protocol and port, to `FRONTEND_ORIGINS`.


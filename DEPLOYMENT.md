# Deployment Guide

This MVP is ready for a split deployment:

- Frontend: Vercel
- Backend: Render
- Source control: GitHub

## GitHub Preparation

Do commit:

```text
.env.example
backend/.env.example
frontend/.env.example
backend/Dockerfile
backend/requirements.txt
frontend/package.json
frontend/package-lock.json
source files, sample data, sample reports, docs
```

Do not commit:

```text
backend/.env
frontend/.env.local
backend/.venv
frontend/node_modules
frontend/.next
__pycache__
.pytest_cache
*.log
```

These are covered by `.gitignore`.

## Backend on Render

Recommended service type: **Web Service**

Settings:

```text
Name: reportdoctor-api
Root Directory: backend
Runtime: Python
Build Command: pip install -r requirements.txt
Start Command: python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
Health Check Path: /health
```

If Render does not inject `$PORT` in your selected setup, use:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Required Render environment variables:

```text
FRONTEND_ORIGINS=https://YOUR-VERCEL-URL.vercel.app
MAX_UPLOAD_MB=10
MAX_COLUMNS=200
REQUEST_TIMEOUT_SECONDS=60
RATE_LIMIT_REQUESTS=60
RATE_LIMIT_WINDOW_SECONDS=60
PAID_UNLOCK_CODE=change-this-code
CONTACT_EMAIL=hello@reportdoctor.pk
```

After adding a custom domain later, update:

```text
FRONTEND_ORIGINS=https://YOUR-VERCEL-URL.vercel.app,https://reportdoctor.pk,https://www.reportdoctor.pk
```

Backend public URLs to verify:

```text
https://YOUR-RENDER-BACKEND-URL.onrender.com/health
https://YOUR-RENDER-BACKEND-URL.onrender.com/docs
```

## Backend Docker Option

The backend includes `backend/Dockerfile`.

Build locally where Docker is installed:

```bash
cd backend
docker build -t reportdoctor-api .
```

Run locally:

```bash
docker run -p 8000:8000 --env-file .env reportdoctor-api
```

The container start command is:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Frontend on Vercel

Recommended project settings:

```text
Framework Preset: Next.js
Root Directory: frontend
Install Command: npm install
Build Command: npm run build
Output Directory: leave default
```

Required Vercel environment variables:

```text
NEXT_PUBLIC_API_URL=https://YOUR-RENDER-BACKEND-URL.onrender.com
NEXT_PUBLIC_SITE_URL=https://YOUR-VERCEL-URL.vercel.app
NEXT_PUBLIC_CONTACT_EMAIL=hello@reportdoctor.pk
NEXT_PUBLIC_JAZZCASH_NUMBER=03XX-XXXXXXX
NEXT_PUBLIC_EASYPAISA_NUMBER=03XX-XXXXXXX
NEXT_PUBLIC_BANK_DETAILS=Bank name / account title / IBAN
NEXT_PUBLIC_WHATSAPP_NUMBER=923000000000
```

After adding the real domain later, update:

```text
NEXT_PUBLIC_SITE_URL=https://reportdoctor.pk
```

Then redeploy the frontend so sitemap and metadata use the live domain.

## Production API URL

The frontend does not hard-code localhost. It reads:

```text
NEXT_PUBLIC_API_URL
```

For production, set it to Render:

```text
NEXT_PUBLIC_API_URL=https://YOUR-RENDER-BACKEND-URL.onrender.com
```

For local development only:

```text
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## CORS

The backend does not need localhost in production if `FRONTEND_ORIGINS` is set correctly.

For initial Vercel deployment:

```text
FRONTEND_ORIGINS=https://YOUR-VERCEL-URL.vercel.app
```

For final domain:

```text
FRONTEND_ORIGINS=https://reportdoctor.pk,https://www.reportdoctor.pk
```

During transition:

```text
FRONTEND_ORIGINS=https://YOUR-VERCEL-URL.vercel.app,https://reportdoctor.pk,https://www.reportdoctor.pk
```

## Domain Setup for ReportDoctor.pk

1. In Vercel, add `reportdoctor.pk` and `www.reportdoctor.pk` to the frontend project.
2. Follow Vercel DNS instructions, usually an A record for apex and CNAME for `www`.
3. In Vercel, set:

```text
NEXT_PUBLIC_SITE_URL=https://reportdoctor.pk
NEXT_PUBLIC_API_URL=https://YOUR-RENDER-BACKEND-URL.onrender.com
```

4. In Render, update:

```text
FRONTEND_ORIGINS=https://reportdoctor.pk,https://www.reportdoctor.pk
```

5. Redeploy frontend and backend.
6. Confirm:

```text
https://reportdoctor.pk/sitemap.xml
https://reportdoctor.pk/robots.txt
```

7. Submit sitemap in Google Search Console:

```text
https://reportdoctor.pk/sitemap.xml
```

## Post-Deployment Verification Checklist

- [ ] Open frontend live URL.
- [ ] Open backend `/health` live URL.
- [ ] Open backend `/docs` live URL.
- [ ] Open `/free-scan`.
- [ ] Test CSV upload.
- [ ] Test XLSX upload.
- [ ] Confirm charts render.
- [ ] Confirm English insights render.
- [ ] Confirm Roman Urdu insights render.
- [ ] Test wrong unlock code returns a 403-style user message.
- [ ] Test valid unlock code downloads PDF.
- [ ] Test mobile view.
- [ ] Open `/sitemap.xml`.
- [ ] Open `/robots.txt`.
- [ ] Open `/pricing`, `/templates`, `/sample-reports`, `/learn`, `/privacy`, and `/terms`.

## Production Safety Notes

- Keep `MAX_UPLOAD_MB=10` unless hosting limits and costs are reviewed.
- Add Render or proxy-level request body limits matching `MAX_UPLOAD_MB`.
- Add provider-level rate limiting or WAF rules for `/analyze` and `/report/pdf`.
- Keep uploads processed in memory unless you add storage intentionally.
- Replace shared `PAID_UNLOCK_CODE` with per-order tokens before serious paid volume.
- Add malware scanning before accepting sensitive public uploads at scale.
- Monitor logs and error rates after launch.


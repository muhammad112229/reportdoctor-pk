# Launch Checklist

## Domain and Hosting

- [ ] Domain connected: `reportdoctor.pk`
- [ ] Optional `www.reportdoctor.pk` redirect configured
- [ ] Backend domain connected: `api.reportdoctor.pk`
- [ ] HTTPS enabled for frontend and backend
- [ ] Live frontend verified: `https://reportdoctor-pk.vercel.app`
- [ ] Live backend verified: `https://reportdoctor-api.vercel.app`
- [ ] Frontend production env set
- [ ] Backend production env set

## API and CORS

- [ ] `NEXT_PUBLIC_API_URL` points to production API
- [ ] `FRONTEND_ORIGINS` contains production frontend origins
- [ ] `MAX_UPLOAD_MB=10` or another reviewed public limit
- [ ] `PAID_UNLOCK_CODE` replaced with a private value
- [ ] `/health` returns OK
- [ ] `/analyze` works from browser
- [ ] `/report/pdf` works with valid unlock code

## SEO

- [ ] `/sitemap.xml` loads
- [ ] `/robots.txt` loads
- [ ] Google Search Console property added
- [ ] Sitemap submitted in Search Console
- [ ] Homepage title and description reviewed
- [ ] Free Scan title and description reviewed
- [ ] OG placeholder replaced with final branded image

## Google Search Console Setup

- [ ] Add the live Vercel URL or final domain as a Search Console property
- [ ] Verify ownership using the recommended DNS or HTML tag method
- [ ] Submit `https://reportdoctor-pk.vercel.app/sitemap.xml`
- [ ] Request indexing for the homepage
- [ ] Request indexing for `/free-scan`, `/pricing`, and public tool pages
- [ ] Check Coverage/Pages report after Google crawls the sitemap

## Analytics and Monitoring

- [ ] Analytics provider selected or intentionally skipped
- [ ] Error monitoring/log review process selected
- [ ] Backend request/error logs visible
- [ ] Rate-limit or WAF rule added at hosting/proxy level

## Product Smoke Tests

- [ ] Upload sales CSV sample
- [ ] Upload XLSX sample
- [ ] Check missing values and duplicate rows display
- [ ] Check charts render
- [ ] Check English insights render
- [ ] Check Roman Urdu insights render
- [ ] Check invalid file error
- [ ] Check oversized file error
- [ ] Check PDF locked message
- [ ] Check PDF download with valid code
- [ ] Check mobile `/free-scan`

## Legal and Payments

- [ ] Privacy policy reviewed
- [ ] Terms and disclaimer reviewed
- [ ] Footer disclaimer visible
- [ ] Easypaisa number verified
- [ ] WhatsApp screenshot verification flow tested
- [ ] Bank transfer details confirmed as unavailable or shared manually on WhatsApp
- [ ] WhatsApp contact link verified
- [ ] Manual payment workflow documented for admin

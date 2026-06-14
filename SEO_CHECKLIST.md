# SEO Checklist

## Technical SEO

- `/sitemap.xml` includes homepage, tools, free scan, pricing, sample reports, templates, learn/blog pages, policies, and aliases.
- `/robots.txt` allows crawling and points to the sitemap.
- Each main page has a unique title and meta description.
- Open Graph and Twitter metadata are configured in `frontend/app/layout.tsx`.
- Placeholder OG image exists at `frontend/public/og-placeholder.svg`; replace it with a final branded PNG/JPG before launch.
- FAQ schema is used on tool pages through `FAQSchema`.
- Internal links connect homepage, tools, free scan, pricing, templates, sample reports, learn, privacy, and terms pages.

## Priority Pages

- Home: `/`
- Free scan: `/free-scan`
- Tools hub: `/tools`
- Sales report generator
- Inventory report generator
- Missing values checker
- Duplicate rows finder
- Survey data analyzer
- CSV to PDF report generator
- Pricing: `/pricing`
- Templates: `/templates`
- Sample reports: `/sample-reports`
- Learn: `/learn`
- Contact: `/contact`
- Privacy: `/privacy`
- Terms: `/terms`

## Content SEO

- Use Pakistani small-business examples naturally: Daraz sellers, shopkeepers, clinics, tuition academies, NGOs, researchers.
- Keep Roman Urdu helper copy on tool pages but retain English headings for broad search visibility.
- Add real screenshots or report previews before launch.
- Expand blog posts with examples, screenshots, and FAQs over time.
- Add author/update metadata later if the blog becomes a major acquisition channel.

## Search Console Launch

- Submit `https://reportdoctor.pk/sitemap.xml`.
- Inspect `/`, `/free-scan`, `/pricing`, `/templates`, and `/learn`.
- Check mobile usability.
- Monitor indexing, duplicate titles, and crawl errors.

## Trust and Compliance

- Keep privacy policy accurate to actual upload/storage behavior.
- Keep disclaimer visible in footer and generated PDF.
- Do not claim certified legal, medical, tax, or accounting advice.
- Review payment details before launch.


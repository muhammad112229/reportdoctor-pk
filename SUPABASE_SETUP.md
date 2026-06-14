# Supabase Setup for ReportDoctor.pk

The SaaS authentication, dashboard, order, admin approval, and report credit flow must use a real Supabase project. Do not use localStorage-only authentication.

## 1. Create Supabase Project

1. Open `https://supabase.com`.
2. Create a new project.
3. Save the database password securely.
4. In the Supabase dashboard, open **Project Settings > API**.

## 2. Copy Required Values

Copy these values from Supabase:

```text
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
SUPABASE_URL=<Project URL>
SUPABASE_SERVICE_ROLE_KEY=<service_role secret key>
```

The anon key is public and goes to the frontend. The service role key is private and must only be used by the backend/Vercel server environment.

## 3. Local Env Files

Create or update local files, but do not commit them:

Frontend `frontend/.env.local`:

```text
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_SITE_URL=https://reportdoctor-pk.vercel.app
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
NEXT_PUBLIC_CONTACT_EMAIL=hello@reportdoctor.pk
NEXT_PUBLIC_EASYPAISA_NUMBER=03100906678
NEXT_PUBLIC_WHATSAPP_NUMBER=923100906678
```

Backend `backend/.env`:

```text
FRONTEND_ORIGINS=http://127.0.0.1:3000,http://localhost:3000,https://reportdoctor-pk.vercel.app
MAX_UPLOAD_MB=10
MAX_COLUMNS=200
REQUEST_TIMEOUT_SECONDS=60
RATE_LIMIT_REQUESTS=60
RATE_LIMIT_WINDOW_SECONDS=60
SUPABASE_URL=<Project URL>
SUPABASE_SERVICE_ROLE_KEY=<service_role secret key>
CONTACT_EMAIL=hello@reportdoctor.pk
```

## 4. Vercel Env Vars

Frontend Vercel project `reportdoctor-pk`:

```text
NEXT_PUBLIC_API_URL=https://reportdoctor-api.vercel.app
NEXT_PUBLIC_SITE_URL=https://reportdoctor-pk.vercel.app
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
NEXT_PUBLIC_CONTACT_EMAIL=hello@reportdoctor.pk
NEXT_PUBLIC_EASYPAISA_NUMBER=03100906678
NEXT_PUBLIC_WHATSAPP_NUMBER=923100906678
```

Backend Vercel project `reportdoctor-api`:

```text
FRONTEND_ORIGINS=https://reportdoctor-pk.vercel.app,http://localhost:3000,http://127.0.0.1:3000
MAX_UPLOAD_MB=10
MAX_COLUMNS=200
REQUEST_TIMEOUT_SECONDS=60
RATE_LIMIT_REQUESTS=60
RATE_LIMIT_WINDOW_SECONDS=60
SUPABASE_URL=<Project URL>
SUPABASE_SERVICE_ROLE_KEY=<service_role secret key>
CONTACT_EMAIL=hello@reportdoctor.pk
```

## 5. Run Database Schema

1. Open Supabase **SQL Editor**.
2. Paste the contents of `supabase/schema.sql`.
3. Run the SQL.
4. Create your first user through the signup flow once implemented.
5. Promote that user to admin:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

## 6. Storage Note

Payment screenshot upload can use Supabase Storage later. For MVP, the fallback is:

1. User pays through Easypaisa.
2. User clicks the WhatsApp button and sends the screenshot.
3. Admin manually approves the pending order in the admin dashboard.
4. Approval creates report credits for the user.


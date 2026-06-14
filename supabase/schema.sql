-- ReportDoctor.pk Supabase schema
-- Run this in the Supabase SQL editor after creating the project.
-- After your first admin user signs up, set their role with:
-- update public.profiles set role = 'admin' where email = 'admin@example.com';

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  whatsapp text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.plans (
  id text primary key,
  name text not null,
  price_pkr integer not null check (price_pkr >= 0),
  description text not null,
  report_credits integer not null check (report_credits >= 0),
  features jsonb not null default '[]'::jsonb,
  active boolean not null default true
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null references public.plans(id),
  amount_pkr integer not null check (amount_pkr >= 0),
  payment_method text not null default 'easypaisa',
  payment_number text,
  screenshot_url text,
  status text not null default 'pending' check (status in ('pending', 'sent_on_whatsapp', 'approved', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table if not exists public.report_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  credits_total integer not null check (credits_total >= 0),
  credits_used integer not null default 0 check (credits_used >= 0),
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  created_at timestamptz not null default now(),
  constraint credits_used_not_more_than_total check (credits_used <= credits_total)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  filename text not null,
  mode text not null,
  free_scan_json jsonb,
  pdf_unlocked boolean not null default false,
  created_at timestamptz not null default now()
);

insert into public.plans (id, name, price_pkr, description, report_credits, features, active)
values
  ('free-scan', 'Free Scan', 0, 'Free upload preview with data quality checks and limited charts.', 0, '["CSV/XLSX upload", "Missing values", "Duplicate rows", "Limited charts"]'::jsonb, true),
  ('basic-pdf', 'Basic PDF Report', 300, 'One clean PDF report for simple files and quick sharing.', 1, '["1 PDF report credit", "Data quality summary", "Basic charts", "Plain English insights"]'::jsonb, true),
  ('business-report', 'Business Report', 700, 'Deeper report for shops, sellers, academies, clinics, and NGOs.', 3, '["3 report credits", "Business mode insights", "Roman Urdu guidance", "Recommendations"]'::jsonb, true),
  ('pro-report', 'Pro Report', 1500, 'Priority manual verification and polished PDF report workflow.', 7, '["7 report credits", "Priority verification", "Template guidance", "WhatsApp support"]'::jsonb, true)
on conflict (id) do update set
  name = excluded.name,
  price_pkr = excluded.price_pkr,
  description = excluded.description,
  report_credits = excluded.report_credits,
  features = excluded.features,
  active = excluded.active;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.orders enable row level security;
alter table public.report_credits enable row level security;
alter table public.reports enable row level security;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles_update_own_basic_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "plans_read_active"
  on public.plans for select
  using (active = true or public.is_admin());

create policy "orders_select_own_or_admin"
  on public.orders for select
  using (user_id = auth.uid() or public.is_admin());

create policy "orders_insert_own"
  on public.orders for insert
  with check (user_id = auth.uid());

create policy "orders_update_own_payment_or_admin"
  on public.orders for update
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "credits_select_own_or_admin"
  on public.report_credits for select
  using (user_id = auth.uid() or public.is_admin());

create policy "credits_admin_write"
  on public.report_credits for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "reports_select_own_or_admin"
  on public.reports for select
  using (user_id = auth.uid() or public.is_admin());

create policy "reports_insert_own_or_guest"
  on public.reports for insert
  with check (user_id is null or user_id = auth.uid());

create policy "reports_update_own_or_admin"
  on public.reports for update
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

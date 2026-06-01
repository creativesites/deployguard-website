-- ─────────────────────────────────────────────────────────────────────────────
-- DeployGuard OS — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Tenants (one per security company)
create table if not exists tenants (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  subdomain       text unique not null,
  owner_email     text not null,
  odoo_db_name    text,
  status          text not null default 'provisioning'
                    check (status in ('provisioning', 'active', 'suspended')),
  provisioned_at  timestamptz,
  phone           text,
  country         text,
  created_at      timestamptz not null default now()
);

-- Licenses (one per tenant)
create table if not exists licenses (
  id                      uuid primary key default gen_random_uuid(),
  key                     uuid unique not null default gen_random_uuid(),
  tenant_id               uuid not null references tenants(id) on delete cascade,
  type                    text not null default 'normal'
                            check (type in ('dogforce_special', 'normal')),
  tier                    text check (tier in ('starter', 'professional', 'enterprise')),
  status                  text not null default 'preview'
                            check (status in ('preview', 'active', 'expired', 'suspended')),
  preview_expires_at      timestamptz,
  subscription_expires_at timestamptz,
  guard_limit             int not null default 50,
  stripe_subscription_id  text,
  stripe_customer_id      text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger licenses_updated_at before update on licenses
  for each row execute function update_updated_at();

-- Sales leads (from the website contact/trial form)
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  company_name  text not null,
  contact_name  text,
  email         text not null,
  phone         text not null,
  country       text,
  guard_count   int,
  message       text,
  status        text not null default 'new'
                  check (status in ('new', 'contacted', 'converted', 'lost')),
  source        text not null default 'website',
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

alter table tenants  enable row level security;
alter table licenses enable row level security;
alter table leads    enable row level security;

-- Tenants: owner can read their own row (matched by email)
create policy "Tenant owner read"
  on tenants for select
  using (owner_email = auth.email());

-- Licenses: readable by the owner of the linked tenant
create policy "License owner read"
  on licenses for select
  using (
    exists (
      select 1 from tenants
      where tenants.id = licenses.tenant_id
        and tenants.owner_email = auth.email()
    )
  );

-- Leads: anyone can insert (contact form), nobody can read via client
create policy "Lead insert public"
  on leads for insert
  with check (true);

-- Service-role key bypasses RLS automatically — used by API routes.

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────
create index if not exists idx_licenses_tenant_id  on licenses(tenant_id);
create index if not exists idx_licenses_key        on licenses(key);
create index if not exists idx_licenses_status     on licenses(status);
create index if not exists idx_tenants_owner_email on tenants(owner_email);
create index if not exists idx_tenants_subdomain   on tenants(subdomain);

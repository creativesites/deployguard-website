-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 004 — APK download tracking
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists apk_downloads (
  id              uuid primary key default gen_random_uuid(),
  fingerprint_id  text,
  ip_address      text,
  country_code    text,
  city            text,
  user_agent      text,
  app_version     text,
  referrer        text,
  created_at      timestamptz not null default now()
);

alter table apk_downloads enable row level security;

-- Writes go through API routes using the service-role key (bypasses RLS).
-- No client-side read policy needed.

create index if not exists idx_apk_downloads_created  on apk_downloads(created_at desc);
create index if not exists idx_apk_downloads_fp       on apk_downloads(fingerprint_id);
create index if not exists idx_apk_downloads_country  on apk_downloads(country_code);

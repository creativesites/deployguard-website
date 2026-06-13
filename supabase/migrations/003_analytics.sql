-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 003 — Visitor analytics & event tracking
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- All fingerprinted site visitors (anonymous + form submitters)
create table if not exists visitors (
  id               uuid primary key default gen_random_uuid(),
  fingerprint_id   text unique not null,
  ip_address       text,
  country_code     text,
  city             text,
  browser          text,
  device_type      text,
  referrer         text,
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  visit_count      int not null default 1,
  page_views       int not null default 0,
  first_seen_at    timestamptz not null default now(),
  last_seen_at     timestamptz not null default now(),
  demo_page_viewed boolean not null default false,
  form_submitted   boolean not null default false
);

-- Granular event stream per visitor
create table if not exists visitor_events (
  id              uuid primary key default gen_random_uuid(),
  fingerprint_id  text not null,
  event_type      text not null, -- 'page_view' | 'cta_click' | 'demo_page' | 'form_submit' | 'feature_click'
  page            text,
  element         text,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

-- Link leads back to visitor record + admin notes
alter table leads
  add column if not exists visitor_fingerprint_id text,
  add column if not exists notes                  text;

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

alter table visitors      enable row level security;
alter table visitor_events enable row level security;

-- All writes go through API routes that use the service-role key (bypasses RLS).
-- No client-side read policies needed.

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────

create index if not exists idx_visitors_fingerprint_id  on visitors(fingerprint_id);
create index if not exists idx_visitors_last_seen_at    on visitors(last_seen_at desc);
create index if not exists idx_visitors_first_seen_at   on visitors(first_seen_at desc);
create index if not exists idx_visitors_country_code    on visitors(country_code);

create index if not exists idx_visitor_events_fp        on visitor_events(fingerprint_id);
create index if not exists idx_visitor_events_created   on visitor_events(created_at desc);
create index if not exists idx_visitor_events_type      on visitor_events(event_type);

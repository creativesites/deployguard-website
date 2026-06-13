-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 002 — Fingerprint & visitor tracking columns on leads
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────

alter table leads
  add column if not exists fingerprint_id  text,
  add column if not exists ip_address      text,
  add column if not exists country_code    text,
  add column if not exists city            text,
  add column if not exists browser         text,
  add column if not exists device_type     text,
  add column if not exists visit_count     int  not null default 1,
  add column if not exists last_seen_at    timestamptz not null default now();

create index if not exists idx_leads_fingerprint_id on leads(fingerprint_id);

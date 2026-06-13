import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const admin  = createAdminClient()
  const search = new URL(req.url).searchParams.get('q')?.toLowerCase() ?? ''

  const { data, error } = await admin
    .from('visitors')
    .select('id, fingerprint_id, ip_address, country_code, city, browser, device_type, referrer, visit_count, page_views, demo_page_viewed, form_submitted, first_seen_at, last_seen_at, utm_source')
    .order('last_seen_at', { ascending: false })
    .limit(500)

  if (error) {
    console.error('Failed to fetch visitors:', error.message)
    return NextResponse.json({ visitors: [] }, { status: 500 })
  }

  // Fetch associated leads for identified visitors
  const fps = (data ?? []).filter(v => v.form_submitted).map(v => v.fingerprint_id)
  let leadsMap: Record<string, { company_name: string; contact_name: string | null; email: string; status: string }> = {}
  if (fps.length > 0) {
    const { data: leads } = await admin
      .from('leads')
      .select('fingerprint_id, company_name, contact_name, email, status')
      .in('fingerprint_id', fps)
    for (const l of leads ?? []) {
      if (l.fingerprint_id) leadsMap[l.fingerprint_id] = l
    }
  }

  const visitors = (data ?? []).map(v => ({
    ...v,
    lead: leadsMap[v.fingerprint_id] ?? null,
  }))

  // Client-side search filter
  const filtered = search
    ? visitors.filter(v =>
        v.lead?.company_name?.toLowerCase().includes(search) ||
        v.lead?.contact_name?.toLowerCase().includes(search) ||
        v.lead?.email?.toLowerCase().includes(search) ||
        v.country_code?.toLowerCase().includes(search) ||
        v.city?.toLowerCase().includes(search)
      )
    : visitors

  return NextResponse.json({ visitors: filtered })
}

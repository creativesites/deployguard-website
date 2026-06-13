import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  const admin = createAdminClient()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [
    visitorsRes,
    newThisWeekRes,
    returningRes,
    demoViewedRes,
    formSubmittedRes,
    leadsRes,
    newLeadsRes,
    allVisitorsRes,
    recentLeadsRes,
    recentVisitorsRes,
  ] = await Promise.all([
    admin.from('visitors').select('*', { count: 'exact', head: true }),
    admin.from('visitors').select('*', { count: 'exact', head: true }).gte('first_seen_at', weekAgo),
    admin.from('visitors').select('*', { count: 'exact', head: true }).gt('visit_count', 1),
    admin.from('visitors').select('*', { count: 'exact', head: true }).eq('demo_page_viewed', true),
    admin.from('visitors').select('*', { count: 'exact', head: true }).eq('form_submitted', true),
    admin.from('leads').select('*', { count: 'exact', head: true }),
    admin.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
    admin.from('visitors').select('country_code, device_type'),
    admin.from('leads')
      .select('id, company_name, contact_name, email, country, status, guard_count, created_at')
      .order('created_at', { ascending: false })
      .limit(6),
    admin.from('visitors')
      .select('id, fingerprint_id, country_code, city, device_type, browser, visit_count, demo_page_viewed, form_submitted, last_seen_at, first_seen_at')
      .order('last_seen_at', { ascending: false })
      .limit(10),
  ])

  const total      = visitorsRes.count ?? 0
  const totalLeads = leadsRes.count    ?? 0

  // Aggregate country & device breakdowns
  const countryCounts: Record<string, number> = {}
  const deviceCounts:  Record<string, number> = {}
  for (const v of allVisitorsRes.data ?? []) {
    if (v.country_code) countryCounts[v.country_code] = (countryCounts[v.country_code] ?? 0) + 1
    if (v.device_type)  deviceCounts[v.device_type]   = (deviceCounts[v.device_type]   ?? 0) + 1
  }

  const topCountries   = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const deviceBreakdown = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1])

  return NextResponse.json({
    stats: {
      totalVisitors:  total,
      newThisWeek:    newThisWeekRes.count    ?? 0,
      returning:      returningRes.count      ?? 0,
      demoViewed:     demoViewedRes.count     ?? 0,
      formSubmitted:  formSubmittedRes.count  ?? 0,
      totalLeads,
      newLeads:       newLeadsRes.count       ?? 0,
      conversionRate: total > 0 ? Math.round((totalLeads / total) * 100) : 0,
    },
    topCountries,
    deviceBreakdown,
    recentLeads:    recentLeadsRes.data    ?? [],
    recentVisitors: recentVisitorsRes.data ?? [],
  })
}

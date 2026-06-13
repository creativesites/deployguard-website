import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  const admin   = createAdminClient()
  const weekAgo = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000).toISOString()
  const dayAgo  = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const [totalRes, weekRes, dayRes, allRes] = await Promise.all([
    admin.from('apk_downloads').select('*', { count: 'exact', head: true }),
    admin.from('apk_downloads').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
    admin.from('apk_downloads').select('*', { count: 'exact', head: true }).gte('created_at', dayAgo),
    admin.from('apk_downloads').select('country_code, created_at').order('created_at', { ascending: false }).limit(500),
  ])

  const rows = allRes.data ?? []

  // Country breakdown
  const countryCounts: Record<string, number> = {}
  for (const r of rows) {
    if (r.country_code) {
      countryCounts[r.country_code] = (countryCounts[r.country_code] ?? 0) + 1
    }
  }
  const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)

  // Daily trend (last 14 days)
  const dayCounts: Record<string, number> = {}
  for (const r of rows) {
    const day = r.created_at.slice(0, 10)
    dayCounts[day] = (dayCounts[day] ?? 0) + 1
  }
  const trend = Object.entries(dayCounts).sort((a, b) => a[0].localeCompare(b[0])).slice(-14)

  // Recent downloads
  const { data: recent } = await admin
    .from('apk_downloads')
    .select('id, fingerprint_id, ip_address, country_code, city, app_version, created_at')
    .order('created_at', { ascending: false })
    .limit(20)

  return NextResponse.json({
    stats: {
      total:    totalRes.count ?? 0,
      thisWeek: weekRes.count  ?? 0,
      today:    dayRes.count   ?? 0,
    },
    topCountries,
    trend,
    recent: recent ?? [],
    apkAvailable: !!process.env.APK_DOWNLOAD_URL,
    apkVersion:   process.env.APK_VERSION ?? null,
  })
}

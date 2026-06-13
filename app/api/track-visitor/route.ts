import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const {
      fingerprintId, browser, deviceType,
      ipAddress, countryCode, city,
      referrer, utmSource, utmMedium, utmCampaign,
    } = await req.json()

    if (!fingerprintId) return NextResponse.json({ ok: false })

    const ip = ipAddress
      || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || null

    const admin = createAdminClient()

    const { data: existing } = await admin
      .from('visitors')
      .select('id, visit_count, ip_address, country_code, city')
      .eq('fingerprint_id', fingerprintId)
      .maybeSingle()

    if (existing) {
      await admin.from('visitors').update({
        visit_count:  existing.visit_count + 1,
        last_seen_at: new Date().toISOString(),
        ip_address:   ip ?? existing.ip_address ?? null,
        country_code: countryCode ?? existing.country_code ?? null,
        city:         city ?? existing.city ?? null,
      }).eq('fingerprint_id', fingerprintId)
    } else {
      await admin.from('visitors').insert({
        fingerprint_id: fingerprintId,
        ip_address:     ip,
        country_code:   countryCode ?? null,
        city:           city ?? null,
        browser:        browser ?? null,
        device_type:    deviceType ?? null,
        referrer:       referrer ?? null,
        utm_source:     utmSource ?? null,
        utm_medium:     utmMedium ?? null,
        utm_campaign:   utmCampaign ?? null,
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

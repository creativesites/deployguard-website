import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const {
    companyName, contactName, email, phone, country, guardCount, message,
    fingerprintId, ipAddress, countryCode, city, browser, deviceType,
  } = await req.json()

  if (!companyName || !email || !phone) {
    return NextResponse.json({ error: 'companyName, email, and phone are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('leads').insert({
    company_name:            companyName,
    contact_name:            contactName   ?? null,
    email,
    phone,
    country:                 country       ?? null,
    guard_count:             guardCount    ?? null,
    message:                 message       ?? null,
    status:                  'new',
    source:                  'website',
    fingerprint_id:          fingerprintId ?? null,
    visitor_fingerprint_id:  fingerprintId ?? null,
    ip_address:              ipAddress     ?? null,
    country_code:            countryCode   ?? null,
    city:                    city          ?? null,
    browser:                 browser       ?? null,
    device_type:             deviceType    ?? null,
    last_seen_at:            new Date().toISOString(),
  })

  // Mark the visitor record as having submitted the form
  if (!error && fingerprintId) {
    await admin.from('visitors')
      .update({ form_submitted: true, last_seen_at: new Date().toISOString() })
      .eq('fingerprint_id', fingerprintId)
  }

  if (error) {
    console.error('Failed to save lead:', error.message)
    return NextResponse.json({ error: 'Failed to save request' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

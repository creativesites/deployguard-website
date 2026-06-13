import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// Set APK_DOWNLOAD_URL in .env.local when the APK is ready:
//   APK_DOWNLOAD_URL=https://yourcdn.com/deployguard-v1.0.apk
//
// Optionally set APK_VERSION (defaults to "1.0.0") and APK_FILE_SIZE (e.g. "42 MB").

export async function GET(req: NextRequest) {
  const downloadUrl = process.env.APK_DOWNLOAD_URL ?? null

  if (!downloadUrl) {
    return NextResponse.json(
      { available: false, message: 'APK not yet available' },
      { status: 404 },
    )
  }

  return NextResponse.json({
    available:    true,
    url:          downloadUrl,
    version:      process.env.APK_VERSION       ?? '1.0.0',
    fileSizeMb:   process.env.APK_FILE_SIZE_MB  ?? null,
    minAndroid:   process.env.APK_MIN_ANDROID   ?? '8.0',
  })
}

export async function POST(req: NextRequest) {
  const downloadUrl = process.env.APK_DOWNLOAD_URL ?? null
  if (!downloadUrl) {
    return NextResponse.json({ error: 'APK not available' }, { status: 404 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { fingerprintId, countryCode, city } = body

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
              || req.headers.get('x-real-ip')
              || null

    const admin = createAdminClient()

    // Log the download
    await admin.from('apk_downloads').insert({
      fingerprint_id: fingerprintId ?? null,
      ip_address:     ip,
      country_code:   countryCode   ?? null,
      city:           city          ?? null,
      user_agent:     req.headers.get('user-agent') ?? null,
      app_version:    process.env.APK_VERSION ?? '1.0.0',
      referrer:       req.headers.get('referer')    ?? null,
    })

    // Also log as visitor event for timeline tracking
    if (fingerprintId) {
      await admin.from('visitor_events').insert({
        fingerprint_id: fingerprintId,
        event_type:     'apk_download',
        page:           '/download',
        metadata:       { version: process.env.APK_VERSION ?? '1.0.0' },
      })
    }

    return NextResponse.json({ ok: true, url: downloadUrl })
  } catch {
    return NextResponse.json({ error: 'Failed to log download' }, { status: 500 })
  }
}

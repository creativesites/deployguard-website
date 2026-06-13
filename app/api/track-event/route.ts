import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { fingerprintId, eventType, page, element, metadata } = await req.json()

    if (!fingerprintId || !eventType) return NextResponse.json({ ok: false })

    const admin = createAdminClient()

    await admin.from('visitor_events').insert({
      fingerprint_id: fingerprintId,
      event_type:     eventType,
      page:           page     ?? null,
      element:        element  ?? null,
      metadata:       metadata ?? {},
    })

    // Update visitor flags based on event type
    if (eventType === 'demo_page' || (eventType === 'page_view' && page === '/start')) {
      await admin.from('visitors')
        .update({ demo_page_viewed: true, last_seen_at: new Date().toISOString() })
        .eq('fingerprint_id', fingerprintId)
    }

    if (eventType === 'form_submit') {
      await admin.from('visitors')
        .update({ form_submitted: true, last_seen_at: new Date().toISOString() })
        .eq('fingerprint_id', fingerprintId)
    }

    // Increment page_views counter for page_view events
    if (eventType === 'page_view') {
      const { data: v } = await admin
        .from('visitors')
        .select('page_views')
        .eq('fingerprint_id', fingerprintId)
        .maybeSingle()
      if (v) {
        await admin.from('visitors')
          .update({ page_views: (v.page_views ?? 0) + 1, last_seen_at: new Date().toISOString() })
          .eq('fingerprint_id', fingerprintId)
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

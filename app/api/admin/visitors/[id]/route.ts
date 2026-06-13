import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const admin = createAdminClient()

  const { data: visitor } = await admin
    .from('visitors')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (!visitor) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const fpId = visitor.fingerprint_id

  const [eventsRes, leadRes] = await Promise.all([
    admin.from('visitor_events')
      .select('*')
      .eq('fingerprint_id', fpId)
      .order('created_at', { ascending: false })
      .limit(200),
    admin.from('leads')
      .select('*')
      .eq('fingerprint_id', fpId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  return NextResponse.json({
    visitor,
    events: eventsRes.data ?? [],
    lead:   leadRes.data   ?? null,
  })
}

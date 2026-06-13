import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const fp = req.nextUrl.searchParams.get('fp')
  if (!fp) return NextResponse.json({ found: false })

  const admin = createAdminClient()

  // Mark demo page viewed on the visitor record
  await admin
    .from('visitors')
    .update({ demo_page_viewed: true, last_seen_at: new Date().toISOString() })
    .eq('fingerprint_id', fp)

  // Check if this fingerprint has previously submitted the form
  const { data } = await admin
    .from('leads')
    .select('id, contact_name, company_name, visit_count')
    .eq('fingerprint_id', fp)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data) return NextResponse.json({ found: false })

  // Increment visit count on legacy lead record
  await admin
    .from('leads')
    .update({ visit_count: (data.visit_count ?? 1) + 1, last_seen_at: new Date().toISOString() })
    .eq('fingerprint_id', fp)

  return NextResponse.json({
    found: true,
    name:    data.contact_name ?? null,
    company: data.company_name ?? null,
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { companyName, contactName, email, phone, country, guardCount, message } = await req.json()

  if (!companyName || !email || !phone) {
    return NextResponse.json({ error: 'companyName, email, and phone are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('leads').insert({
    company_name: companyName,
    contact_name: contactName ?? null,
    email,
    phone,
    country:      country     ?? null,
    guard_count:  guardCount  ?? null,
    message:      message     ?? null,
    status:       'new',
    source:       'website',
  })

  if (error) {
    console.error('Failed to save lead:', error.message)
    return NextResponse.json({ error: 'Failed to save request' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

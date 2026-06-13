import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch leads:', error.message)
    return NextResponse.json({ leads: [] }, { status: 500 })
  }
  return NextResponse.json({ leads: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  const { id, status, notes } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const admin = createAdminClient()
  const update: Record<string, string> = {}
  if (status !== undefined) update.status = status
  if (notes  !== undefined) update.notes  = notes

  const { error } = await admin.from('leads').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

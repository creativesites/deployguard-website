import { NextResponse } from 'next/server'

// Stripe not active yet — payments handled manually.
export async function POST() {
  return NextResponse.json({ error: 'Online payments not yet enabled. Contact hello@deployguard.io.' }, { status: 503 })
}

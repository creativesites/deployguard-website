import { NextResponse } from 'next/server'

// Stripe webhooks not active yet.
export async function POST() {
  return NextResponse.json({ received: true })
}

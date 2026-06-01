import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const FEATURE_FLAGS: Record<string, string[]> = {
  starter:      ['basic_roster'],
  professional: ['basic_roster', 'fleet_module', 'advanced_reporting', 'shift_planner_ai'],
  enterprise:   ['basic_roster', 'fleet_module', 'advanced_reporting', 'shift_planner_ai', 'api_access'],
}

// Called daily by the Odoo cron: POST /api/validate-license
// Body: { licenseKey: string, installationId?: string }
export async function POST(req: NextRequest) {
  const { licenseKey } = await req.json()

  if (!licenseKey) {
    return NextResponse.json({ valid: false, reason: 'licenseKey required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: lic, error } = await admin
    .from('licenses')
    .select('*')
    .eq('key', licenseKey)
    .maybeSingle()

  if (error || !lic) {
    return NextResponse.json({ valid: false, reason: 'License not found' })
  }

  // Auto-expire preview licenses whose trial window has closed
  if (lic.status === 'preview' && lic.preview_expires_at && new Date(lic.preview_expires_at) < new Date()) {
    await admin.from('licenses').update({ status: 'expired', updated_at: new Date().toISOString() }).eq('id', lic.id)
    lic.status = 'expired'
  }

  const featureFlags: string[] =
    lic.type === 'dogforce_special'
      ? Object.values(FEATURE_FLAGS).flat()
      : lic.status === 'preview'
        ? FEATURE_FLAGS['professional']   // full access during trial
        : FEATURE_FLAGS[lic.tier ?? 'starter'] ?? []

  const expiresAt: string | null =
    lic.type === 'dogforce_special'   ? null
    : lic.status === 'preview'        ? lic.preview_expires_at
    :                                   lic.subscription_expires_at

  return NextResponse.json({
    valid:       lic.status === 'active' || lic.status === 'preview',
    type:        lic.type,
    tier:        lic.tier,
    status:      lic.status,
    guardLimit:  lic.guard_limit,
    featureFlags,
    expiresAt,
  })
}

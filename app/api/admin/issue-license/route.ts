import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { tenantName, subdomain, ownerEmail, guardLimit } = await req.json()

  if (!tenantName || !subdomain || !ownerEmail) {
    return NextResponse.json({ error: 'tenantName, subdomain, and ownerEmail are required' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: tenant, error: tErr } = await admin
    .from('tenants')
    .insert({ name: tenantName, subdomain, owner_email: ownerEmail, odoo_db_name: `dg_${subdomain}`, status: 'provisioning' })
    .select()
    .single()

  if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 })

  const licenseKey = crypto.randomUUID()
  const { error: lErr } = await admin.from('licenses').insert({
    key: licenseKey, tenant_id: tenant.id, type: 'dogforce_special',
    tier: null, status: 'active', guard_limit: parseInt(guardLimit ?? '0', 10),
  })

  if (lErr) return NextResponse.json({ error: lErr.message }, { status: 500 })

  return NextResponse.json({ licenseKey, tenantId: tenant.id })
}

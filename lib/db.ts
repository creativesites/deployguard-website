import { supabase } from './supabase'
import type { License, Tenant, Lead } from './database.types'

export type { License, Tenant, Lead }

export async function getLicenseByTenantId(tenantId: string): Promise<License | null> {
  const { data } = await supabase
    .from('licenses')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data
}

export async function getTenantByOwnerEmail(email: string): Promise<Tenant | null> {
  const { data } = await supabase
    .from('tenants')
    .select('*')
    .eq('owner_email', email)
    .maybeSingle()
  return data
}

export async function getAllTenants(): Promise<Tenant[]> {
  const { data } = await supabase.from('tenants').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export async function getAllLicenses(): Promise<License[]> {
  const { data } = await supabase.from('licenses').select('*').order('created_at', { ascending: false })
  return data ?? []
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthChange } from '@/lib/auth'
import { getTenantByOwnerEmail, getLicenseByTenantId, License, Tenant } from '@/lib/db'
import { Copy, Check, ExternalLink } from 'lucide-react'

function CopyField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">{label}</p>
      <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-xl px-4 py-3">
        <span className={`flex-1 text-sm truncate ${mono ? 'font-mono text-xs' : 'text-foreground'}`}>{value || '—'}</span>
        {value && (
          <button onClick={copy} className="text-muted-foreground hover:text-primary transition-colors shrink-0">
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [license, setLicense] = useState<License | null>(null)
  const [tenant,  setTenant]  = useState<Tenant  | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthChange(async (user) => {
      if (!user) { router.push('/start'); return }
      const t = await getTenantByOwnerEmail(user.email!)
      if (t) { setTenant(t); setLicense(await getLicenseByTenantId(t.id)) }
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>
  }

  const odooUrl = tenant ? `https://${tenant.subdomain}.deployguard.io` : ''

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Your connection details and license configuration.</p>
      </div>

      <section className="bg-card border border-border rounded-2xl p-6 mb-5">
        <h2 className="text-base font-bold text-foreground mb-5">Odoo Instance</h2>
        <div className="space-y-4">
          {odooUrl && <CopyField label="Instance URL" value={odooUrl} />}
          {tenant?.odoo_db_name && <CopyField label="Database Name" value={tenant.odoo_db_name} mono />}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Status</p>
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/40 border border-border rounded-xl">
              <span className={`w-2 h-2 rounded-full ${tenant?.status === 'active' ? 'bg-success' : 'bg-warning'}`} />
              <span className="text-sm text-foreground capitalize">{tenant?.status ?? 'Unknown'}</span>
            </div>
          </div>
          {odooUrl && (
            <a href={odooUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              Open instance <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-6 mb-5">
        <h2 className="text-base font-bold text-foreground mb-2">License Key</h2>
        <p className="text-xs text-muted-foreground mb-5">
          Enter this key in your Odoo instance under <strong>Settings → DeployGuard License</strong>.
        </p>
        {license
          ? <CopyField label="License Key" value={license.key} mono />
          : <p className="text-sm text-muted-foreground">No license found. Contact support.</p>
        }
      </section>

      <section className="bg-primary-light border border-primary/20 rounded-2xl p-6">
        <h2 className="text-base font-bold text-foreground mb-3">How to activate in Odoo</h2>
        <ol className="space-y-2 text-sm text-foreground list-decimal list-inside">
          <li>Log into your Odoo instance at the URL above.</li>
          <li>Go to <strong>Settings → General Settings</strong>.</li>
          <li>Find the <strong>DeployGuard License</strong> section.</li>
          <li>Paste your license key and click <strong>Validate Now</strong>.</li>
          <li>Status should change to <strong>Active</strong> or <strong>Trial</strong>.</li>
        </ol>
      </section>
    </div>
  )
}

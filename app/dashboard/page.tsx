'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthChange } from '@/lib/auth'
import { getTenantByOwnerEmail, getLicenseByTenantId, License, Tenant } from '@/lib/db'
import LicenseStatusCard from '@/components/LicenseStatusCard'
import { ExternalLink, BookOpen, Headphones } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [license, setLicense] = useState<License | null>(null)
  const [tenant,  setTenant]  = useState<Tenant  | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthChange(async (user) => {
      if (!user) { router.push('/start'); return }
      const t = await getTenantByOwnerEmail(user.email!)
      if (!t) { setLoading(false); return }
      setTenant(t)
      setLicense(await getLicenseByTenantId(t.id))
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>
  }

  const odooUrl = tenant ? `https://${tenant.subdomain}.deployguard.io` : '#'

  const quickLinks = [
    { icon: <ExternalLink className="w-4 h-4" />, label: 'Open Odoo Instance',    desc: 'Go to your DeployGuard OS workspace',         href: odooUrl,                              external: true },
    { icon: <BookOpen     className="w-4 h-4" />, label: 'Getting Started Guide', desc: 'How to add your first guard and site',         href: '#' },
    { icon: <Headphones   className="w-4 h-4" />, label: 'Contact Support',       desc: 'support@deployguard.io',                       href: 'mailto:support@deployguard.io' },
  ]

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">{tenant?.name ?? 'Your Workspace'}</h1>
        {tenant && (
          <p className="text-muted-foreground text-sm mt-1">
            <code className="text-xs bg-muted px-2 py-0.5 rounded">{tenant.subdomain}.deployguard.io</code>
            {' · '}
            <span className={tenant.status === 'active' ? 'text-success' : 'text-warning'}>
              {tenant.status === 'provisioning' ? 'Instance provisioning…' : 'Instance active'}
            </span>
          </p>
        )}
      </div>

      {license
        ? <LicenseStatusCard license={license} />
        : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
            <p className="text-sm font-semibold text-amber-700">No license found.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Contact <a href="mailto:support@deployguard.io" className="underline">support@deployguard.io</a>.
            </p>
          </div>
        )
      }

      <div className="mt-8 grid gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Quick Links</h2>
        {quickLinks.map((link) => (
          <a key={link.label} href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4 hover:shadow-card-hover transition-shadow group">
            <span className="text-primary group-hover:text-accent-foreground transition-colors">{link.icon}</span>
            <div>
              <p className="text-sm font-semibold text-foreground">{link.label}</p>
              <p className="text-xs text-muted-foreground">{link.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

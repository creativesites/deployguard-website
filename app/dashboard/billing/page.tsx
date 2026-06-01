'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { onAuthChange } from '@/lib/auth'
import { getTenantByOwnerEmail, getLicenseByTenantId, License } from '@/lib/db'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { CheckCircle2, Mail } from 'lucide-react'

const PLANS = [
  {
    id:       'starter',
    name:     'Starter',
    limit:    '50 guards',
    features: ['Roster management', 'Mobile GPS check-in', 'Payroll & billing', 'Document tracking'],
  },
  {
    id:       'professional',
    name:     'Professional',
    limit:    '250 guards',
    features: ['Everything in Starter', 'Equipment & fleet', 'Advanced payroll', 'Advanced reporting'],
    highlighted: true,
  },
]

export default function BillingPage() {
  const router = useRouter()
  const [license, setLicense]         = useState<License | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (!user) { router.push('/start'); return }
      const tenant = await getTenantByOwnerEmail(user.email!)
      if (tenant) setLicense(await getLicenseByTenantId(tenant.id))
      setPageLoading(false)
    })
    return unsub
  }, [router])

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-foreground">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">Your current plan and upgrade options.</p>
      </div>

      {/* Current plan */}
      {license && (
        <div className="bg-card border border-border rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Current Plan</p>
            <div className="flex items-center gap-2">
              <p className="font-bold text-foreground capitalize">
                {license.status === 'preview' ? 'Free Trial' : (license.tier ?? 'Standard')}
              </p>
              <Badge color={
                license.status === 'active'   ? 'green'  :
                license.status === 'preview'  ? 'yellow' : 'red'
              }>
                {license.status}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade plans */}
      <h2 className="text-lg font-bold text-foreground mb-4">Available Plans</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {PLANS.map((plan) => (
          <div key={plan.id} className={`rounded-2xl border p-6 ${plan.highlighted ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">{plan.name}</p>
            <p className="text-sm text-primary font-semibold mb-4">Up to {plan.limit}</p>
            <ul className="space-y-2 mb-5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <a href={`mailto:hello@deployguard.io?subject=Upgrade to ${plan.name}`}>
              <Button variant={plan.highlighted ? 'primary' : 'outline'} size="sm" className="w-full justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Contact to Upgrade
              </Button>
            </a>
          </div>
        ))}
      </div>

      <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-6 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">How billing works</p>
        <p>
          Payments are currently handled manually. Email us at{' '}
          <a href="mailto:hello@deployguard.io" className="text-primary hover:underline">hello@deployguard.io</a>{' '}
          to discuss a plan. We&apos;ll issue your licence key and get you live within one business day.
        </p>
      </div>
    </div>
  )
}

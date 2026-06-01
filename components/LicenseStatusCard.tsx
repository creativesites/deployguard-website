'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { Copy, Check, ShieldCheck, Clock, AlertTriangle, XCircle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { License } from '@/lib/db'
import Link from 'next/link'

function statusCfg(status: License['status']) {
  return {
    preview:   { color: 'yellow' as const, Icon: Clock,         label: 'Trial'     },
    active:    { color: 'green'  as const, Icon: ShieldCheck,   label: 'Active'    },
    expired:   { color: 'red'    as const, Icon: XCircle,       label: 'Expired'   },
    suspended: { color: 'red'    as const, Icon: AlertTriangle, label: 'Suspended' },
  }[status]
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null
  return Math.max(0, Math.floor((new Date(iso).getTime() - Date.now()) / 86_400_000))
}

export default function LicenseStatusCard({ license }: { license: License }) {
  const [copied, setCopied] = useState(false)
  const { color, Icon, label } = statusCfg(license.status)

  const days = license.status === 'preview'
    ? daysUntil(license.preview_expires_at)
    : daysUntil(license.subscription_expires_at)

  function copyKey() {
    navigator.clipboard.writeText(license.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">License Status</p>
          <div className="flex items-center gap-2">
            <Icon className={clsx('w-5 h-5', { 'text-success': color === 'green', 'text-warning': color === 'yellow', 'text-destructive': color === 'red' })} />
            <h2 className="text-xl font-bold text-foreground">
              {license.type === 'dogforce_special' ? 'DogForce Special'
                : license.tier ? license.tier.charAt(0).toUpperCase() + license.tier.slice(1)
                : 'Standard'}
            </h2>
            <Badge color={color}>{label}</Badge>
          </div>
        </div>
        {license.status === 'preview' && (
          <Link href="/dashboard/billing"><Button size="sm">Upgrade Now</Button></Link>
        )}
      </div>

      {/* Trial countdown */}
      {license.status === 'preview' && days !== null && (
        <div className={clsx('rounded-xl p-4 mb-6', days <= 2 ? 'bg-destructive/10 border border-destructive/30' : 'bg-amber-50 border border-amber-200')}>
          <p className={clsx('text-sm font-semibold', days <= 2 ? 'text-destructive' : 'text-amber-700')}>
            {days === 0 ? 'Trial expires today.' : `Trial expires in ${days} day${days !== 1 ? 's' : ''}.`}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Contact us to activate a plan and keep your data.</p>
        </div>
      )}

      {/* Expired / suspended */}
      {(license.status === 'expired' || license.status === 'suspended') && (
        <div className="rounded-xl p-4 mb-6 bg-destructive/10 border border-destructive/30">
          <p className="text-sm font-semibold text-destructive">
            {license.status === 'expired' ? 'License expired.' : 'Account suspended.'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Contact <a href="mailto:billing@deployguard.io" className="underline">billing@deployguard.io</a> to reactivate.
          </p>
        </div>
      )}

      {/* Meta grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Guard Limit</p>
          <p className="text-sm font-semibold text-foreground">{license.guard_limit === 0 ? 'Unlimited' : `${license.guard_limit} guards`}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">License Type</p>
          <p className="text-sm font-semibold text-foreground">{license.type === 'dogforce_special' ? 'DogForce Special' : 'Standard'}</p>
        </div>
        {days !== null && license.type !== 'dogforce_special' && (
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{license.status === 'preview' ? 'Trial Ends' : 'Renews In'}</p>
            <p className="text-sm font-semibold text-foreground">{days === 0 ? 'Today' : `${days} day${days !== 1 ? 's' : ''}`}</p>
          </div>
        )}
      </div>

      {/* License key */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">License Key — enter in Odoo Settings</p>
        <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-xl px-4 py-3">
          <code className="flex-1 text-xs font-mono text-foreground truncate">{license.key}</code>
          <button onClick={copyKey} className="text-muted-foreground hover:text-primary transition-colors shrink-0" title="Copy">
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

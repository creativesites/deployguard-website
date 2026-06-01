'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { ArrowLeft, Copy, Check, ShieldCheck } from 'lucide-react'

export default function IssueLicensePage() {
  const router = useRouter()
  const [form, setForm] = useState({ tenantName: '', subdomain: '', ownerEmail: '', guardLimit: '0' })
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [result,   setResult]   = useState<{ licenseKey: string } | null>(null)
  const [copied,   setCopied]   = useState(false)

  function autoSubdomain(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.tenantName || !form.subdomain || !form.ownerEmail) { setError('All fields required.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/admin/issue-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantName: form.tenantName, subdomain: form.subdomain, ownerEmail: form.ownerEmail, guardLimit: form.guardLimit }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setResult({ licenseKey: json.licenseKey })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to issue license.')
    } finally {
      setLoading(false)
    }
  }

  function copyKey() {
    if (result) { navigator.clipboard.writeText(result.licenseKey); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }

  if (result) {
    return (
      <div className="max-w-lg">
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-extrabold text-foreground mb-2">License Issued</h1>
          <p className="text-muted-foreground text-sm mb-6">DogForce Special license created for <strong>{form.tenantName}</strong>.</p>

          <div className="mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2 text-left">License Key</p>
            <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-xl px-4 py-3">
              <code className="flex-1 text-xs font-mono text-foreground truncate">{result.licenseKey}</code>
              <button onClick={copyKey} className="text-muted-foreground hover:text-primary transition-colors">
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6">
            <p className="text-xs font-semibold text-amber-700 mb-1">Next: provision the Odoo instance</p>
            <p className="text-xs text-muted-foreground">
              Run <code className="bg-white px-1 rounded">./scripts/provision-tenant.sh {form.subdomain}</code> on the server.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 justify-center" onClick={() => router.push('/admin')}>Back</Button>
            <Button className="flex-1 justify-center" onClick={() => { setResult(null); setForm({ tenantName: '', subdomain: '', ownerEmail: '', guardLimit: '0' }) }}>Issue Another</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <Link href="/admin" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to tenants
      </Link>
      <h1 className="text-2xl font-extrabold text-foreground mb-1">Issue DogForce Special License</h1>
      <p className="text-muted-foreground text-sm mb-8">Creates a permanent, no-expiry license for a DogForce client.</p>

      {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Company Name</label>
          <input type="text" value={form.tenantName}
            onChange={(e) => setForm({ ...form, tenantName: e.target.value, subdomain: autoSubdomain(e.target.value) })}
            placeholder="DogForce Security Services"
            className="w-full border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-card" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Subdomain</label>
          <div className="flex items-center">
            <input type="text" value={form.subdomain}
              onChange={(e) => setForm({ ...form, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
              placeholder="dogforce"
              className="flex-1 border border-input rounded-l-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-card border-r-0" />
            <span className="bg-muted border border-input rounded-r-xl px-4 py-3 text-sm text-muted-foreground">.deployguard.io</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Client Email</label>
          <input type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
            placeholder="admin@client.com"
            className="w-full border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-card" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Guard Limit</label>
          <select value={form.guardLimit} onChange={(e) => setForm({ ...form, guardLimit: e.target.value })}
            className="w-full border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-card">
            <option value="0">Unlimited</option>
            <option value="50">50 guards</option>
            <option value="250">250 guards</option>
            <option value="500">500 guards</option>
          </select>
        </div>
        <div className="bg-primary-light border border-primary/20 rounded-xl p-4 text-sm">
          <p className="font-semibold text-foreground mb-1">DogForce Special terms</p>
          <ul className="text-xs text-muted-foreground space-y-0.5 list-disc list-inside">
            <li>No expiry — license is permanent</li>
            <li>No payment required</li>
            <li>All features unlocked</li>
          </ul>
        </div>
        <Button type="submit" size="lg" className="w-full justify-center" loading={loading}>Issue License</Button>
      </form>
    </div>
  )
}

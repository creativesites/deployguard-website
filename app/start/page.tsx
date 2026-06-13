'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Shield, ArrowLeft, ExternalLink, Loader2, Globe, Monitor, Smartphone } from 'lucide-react'
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react'

const DEMO_URL = 'http://47.84.205.81:8069/odoo/'

const COUNTRIES = [
  'Namibia', 'Zambia', 'South Africa', 'Botswana', 'Zimbabwe',
  'Kenya', 'Tanzania', 'Uganda', 'Nigeria', 'Ghana', 'Other',
]

const GUARD_OPTIONS = [
  { label: '1 – 50 guards',   value: 50  },
  { label: '51 – 250 guards', value: 250 },
  { label: '251+ guards',     value: 500 },
]

interface FormData {
  companyName:  string
  contactName:  string
  email:        string
  phone:        string
  country:      string
  guardCount:   number
  message:      string
}

type PageState = 'checking' | 'returning' | 'form' | 'submitted'

function openDemo() {
  window.open(DEMO_URL, '_blank', 'noopener,noreferrer')
}

export default function StartPage() {
  const [pageState, setPageState] = useState<PageState>('checking')
  const [returningName, setReturningName] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>({
    companyName: '', contactName: '', email: '',
    phone: '', country: 'Namibia', guardCount: 50, message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const { data: fpData, isLoading: fpLoading } = useVisitorData(
    { extendedResult: true },
    { immediate: true },
  )

  // Once fingerprint resolves, check if this is a returning visitor
  useEffect(() => {
    if (fpLoading || !fpData) return

    async function checkVisitor() {
      try {
        const res = await fetch(`/api/check-visitor?fp=${fpData!.visitorId}`)
        const json = await res.json()
        if (json.found) {
          setReturningName(json.name || null)
          setPageState('returning')
        } else {
          setPageState('form')
        }
      } catch {
        setPageState('form')
      }
    }

    checkVisitor()
  }, [fpLoading, fpData])

  // If fingerprint never loads after 4 s, just show the form
  useEffect(() => {
    const t = setTimeout(() => {
      if (pageState === 'checking') setPageState('form')
    }, 4000)
    return () => clearTimeout(t)
  }, [pageState])

  function set(field: keyof FormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function deriveDeviceType(device: string): string {
    const d = device.toLowerCase()
    if (d.includes('ipad') || d.includes('tablet')) return 'tablet'
    if (d === 'other' || d.includes('mac') || d.includes('pc') || d.includes('windows')) return 'desktop'
    return 'mobile'
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.companyName || !form.email || !form.phone) {
      setError('Please fill in company name, email, and phone.')
      return
    }
    setLoading(true)
    setError('')

    // Open demo immediately — this fires during the user gesture so it won't be blocked
    openDemo()

    try {
      const device = fpData?.device ?? ''
      await fetch('/api/request-trial', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source:        'live_demo',
          fingerprintId: fpData?.visitorId              ?? null,
          ipAddress:     fpData?.ip                     ?? null,
          countryCode:   fpData?.ipLocation?.country?.code ?? null,
          city:          fpData?.ipLocation?.city?.name    ?? null,
          browser:       fpData?.browserName            ?? null,
          deviceType:    device ? deriveDeviceType(device) : null,
        }),
      })
    } catch {
      // Non-blocking — the demo tab is already open
    } finally {
      setLoading(false)
      setPageState('submitted')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/images/deployguard-small.png"
            className="h-16 transition-transform hover:scale-105 duration-500"
            alt="DeployGuard"
          />
          <span className="font-bold text-foreground">DeployGuard OS</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to site
        </Link>
      </header>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">

          {/* ── Checking fingerprint ── */}
          {pageState === 'checking' && (
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">Checking access…</p>
            </div>
          )}

          {/* ── Returning visitor ── */}
          {pageState === 'returning' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-foreground mb-2">
                Welcome back{returningName ? `, ${returningName.split(' ')[0]}` : ''}!
              </h1>
              <p className="text-muted-foreground text-sm mb-8">
                We already have your details on file. Jump straight into the live demo.
              </p>

              <div className="bg-muted/60 border border-border rounded-2xl px-6 py-5 mb-8 text-left text-sm space-y-1">
                <p className="font-semibold text-foreground mb-2">Demo login credentials</p>
                <p className="text-muted-foreground">
                  Click a role card on the login screen to auto-fill credentials.
                </p>
                <p className="text-muted-foreground mt-2">
                  All demo passwords: <strong className="text-foreground font-mono">Demo2026!</strong>
                </p>
              </div>

              <Button size="lg" className="w-full justify-center gap-2" onClick={openDemo}>
                <ExternalLink className="w-4 h-4" />
                Open Live Demo
              </Button>
            </div>
          )}

          {/* ── Lead capture form ── */}
          {pageState === 'form' && (
            <>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
                  <Shield className="w-3.5 h-3.5" /> Live Demo Access
                </div>
                <h1 className="text-3xl font-extrabold text-foreground mb-2">
                  Try DeployGuard right now
                </h1>
                <p className="text-muted-foreground text-sm">
                  Tell us a little about your company and we&apos;ll drop you straight into the live system —
                  no installation, no waiting, no credit card.
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-3 mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Company Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) => set('companyName', e.target.value)}
                      placeholder="Acme Guard Services"
                      className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Your Name</label>
                    <input
                      type="text"
                      value={form.contactName}
                      onChange={(e) => set('contactName', e.target.value)}
                      placeholder="John Nakamura"
                      className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Work Email <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="you@company.com"
                      className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Phone <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+264 81 000 0000"
                      className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Country</label>
                    <select
                      value={form.country}
                      onChange={(e) => set('country', e.target.value)}
                      className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    >
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Guard Count</label>
                    <select
                      value={form.guardCount}
                      onChange={(e) => set('guardCount', Number(e.target.value))}
                      className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    >
                      {GUARD_OPTIONS.map(({ label, value }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full justify-center gap-2" loading={loading}>
                  <ExternalLink className="w-4 h-4" />
                  Enter the Live Demo
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your details are saved so we can follow up. No spam, no automatic billing.
                </p>
              </form>
            </>
          )}

          {/* ── Submitted / demo opened ── */}
          {pageState === 'submitted' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <ExternalLink className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-extrabold text-foreground mb-3">
                Demo opened in a new tab!
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                The live DeployGuard environment should be open in a new browser tab.
                If it didn&apos;t open automatically, use the link below.
              </p>

              <div className="bg-muted/60 border border-border rounded-2xl px-6 py-5 mb-6 text-left text-sm">
                <p className="font-semibold text-foreground mb-2">Demo login credentials</p>
                <p className="text-muted-foreground">
                  Click a role card on the login screen to auto-fill credentials.
                </p>
                <p className="text-muted-foreground mt-2">
                  All demo passwords: <strong className="text-foreground font-mono">Demo2026!</strong>
                </p>
              </div>

              <Button size="lg" className="w-full justify-center gap-2 mb-4" onClick={openDemo}>
                <ExternalLink className="w-4 h-4" />
                Open Demo Again
              </Button>

              <p className="text-xs text-muted-foreground">
                We&apos;ve noted your details and will follow up at{' '}
                <strong className="text-foreground">{form.email}</strong>.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

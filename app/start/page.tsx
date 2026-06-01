'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Shield, Check, ArrowLeft } from 'lucide-react'

const COUNTRIES = [
  'Namibia', 'Zambia', 'South Africa', 'Botswana', 'Zimbabwe',
  'Kenya', 'Tanzania', 'Uganda', 'Nigeria', 'Ghana', 'Other',
]

const GUARD_OPTIONS = [
  { label: '1 – 50 guards',    value: 50  },
  { label: '51 – 250 guards',  value: 250 },
  { label: '251+ guards',      value: 500 },
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

export default function StartPage() {
  const [form, setForm] = useState<FormData>({
    companyName: '', contactName: '', email: '',
    phone: '', country: 'Namibia', guardCount: 50, message: '',
  })
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  function set(field: keyof FormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.companyName || !form.email || !form.phone) {
      setError('Please fill in company name, email, and phone.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/request-trial', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Server error')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please email us at hello@deployguard.io instead.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-foreground">DeployGuard OS</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to site
        </Link>
      </header>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">

          {/* Success state */}
          {submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-extrabold text-foreground mb-3">
                Request received — we&apos;ll be in touch!
              </h1>
              <p className="text-muted-foreground text-sm mb-2">
                We&apos;ll contact <strong className="text-foreground">{form.email}</strong> within one business day
                to arrange your demo and issue your 7-day trial key.
              </p>
              <p className="text-muted-foreground text-sm mb-8">
                In the meantime, email us at{' '}
                <a href="mailto:hello@deployguard.io" className="text-primary hover:underline">
                  hello@deployguard.io
                </a>{' '}
                if you have urgent questions.
              </p>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back to home
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-foreground mb-2">
                  Book a demo & start your free trial
                </h1>
                <p className="text-muted-foreground text-sm">
                  Fill in your details and we&apos;ll reach out within one business day to walk you
                  through the platform and issue your 7-day trial key.
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
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Your Name
                    </label>
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

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    Anything specific you'd like to see? <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder="e.g. We have 12 sites, weekly payroll, need to see the roster board and mobile app..."
                    rows={3}
                    className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full justify-center" loading={loading}>
                  Request Demo & Trial Key
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  We respond within one business day. No spam, no automatic billing.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

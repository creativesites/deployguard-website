import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import ScreenshotShowcase from '@/components/ScreenshotShowcase'
import { MobileAppSection } from '@/components/home/MobileAppSection'
import {
  CalendarDays, DollarSign, MapPin, FileText, Wrench, Sparkles,
  ArrowRight, CheckCircle2, AlertTriangle, TrendingDown, Clock,
  Shield, Globe, Download, PhoneCall, Package, Bot,
} from 'lucide-react'
import { HeroSlider } from '@/components/home/HeroSlider'

export const metadata: Metadata = {
  title: 'DeployGuard OS — Workforce Management for Private Security Companies',
  description:
    'Replace your roster spreadsheet, payroll Excel, and manual invoices with one platform. Auto-rostering, GPS check-in, Namibian payroll compliance, client billing, and AI-powered operations — built for African security companies.',
  alternates: { canonical: 'https://deployguard.io' },
  openGraph: {
    title: 'DeployGuard OS — The Operating System Built for Security',
    description: 'Roster automation, payroll compliance, GPS attendance, and AI-powered shift management in one platform.',
    url: 'https://deployguard.io',
    images: [{ url: '/screenshots/executive-dashboard.png', width: 1280, height: 720 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeployGuard OS — Built for Security Companies',
    description: 'From Windhoek to Lusaka — automate your guards, payroll, and billing.',
    images: ['/screenshots/executive-dashboard.png'],
  },
}


/* ─── Data ────────────────────────────────────────────────────────────────── */

const painPoints = [
  {
    icon:  <AlertTriangle className="w-5 h-5" />,
    title: 'Ghost Workers & Payroll Fraud',
    body:  'Supervisors sign off on shifts that never happened. Manual timesheets are impossible to audit. You\'re paying guards who aren\'t there.',
  },
  {
    icon:  <Clock className="w-5 h-5" />,
    title: 'Roster Chaos Every Week',
    body:  'Matching available guards to posts across multiple sites takes a full day — and still produces conflicts, no-shows, and overtime blowouts.',
  },
  {
    icon:  <TrendingDown className="w-5 h-5" />,
    title: 'Billing Delays & Revenue Leakage',
    body:  'Invoices go out late — if at all. Without accurate shift data attached, clients dispute hours and payments drag on for weeks.',
  },
]

const features = [
  {
    icon:  <CalendarDays className="w-5 h-5" />,
    title: 'Auto-Rostering',
    body:  'Constraint-based scheduling fills every post with a qualified, available guard. Handles overtime rules, rest periods, and site-specific requirements automatically.',
  },
  {
    icon:  <DollarSign className="w-5 h-5" />,
    title: 'Payroll & Local Compliance',
    body:  'Namibian and Zambian labour law built in. Normal time, Saturday, Sunday, public holiday, and night rates — calculated correctly every pay run.',
  },
  {
    icon:  <MapPin className="w-5 h-5" />,
    title: 'Attendance & GPS Check-In',
    body:  'Guards clock in from the mobile app. GPS confirms they are at the right site. No buddy-punching, no ghost workers, no disputes.',
  },
  {
    icon:  <FileText className="w-5 h-5" />,
    title: 'Client Billing & Invoicing',
    body:  'Invoices generated directly from attendance data. Shift logs attached. Sent as branded PDFs in seconds — no more manual billing spreadsheets.',
  },
  {
    icon:  <Wrench className="w-5 h-5" />,
    title: 'Equipment & Firearms Tracking',
    body:  'Track every firearm, radio, and vehicle. License expiry alerts keep you legally compliant without a separate system.',
  },
  {
    icon:  <Sparkles className="w-5 h-5" />,
    title: 'DeployGuard AI Engine',
    body:  'Ten built-in AI tools and a global floating assistant. Automate attendance checks, client billing audits, risk profiles, shift filling, and labor-compliant discipline advice.',
  },
]

const steps = [
  {
    n:     '01',
    title: 'Download & Install',
    body:  'Get the Docker Compose package. Runs on any Linux server or cloud instance. Full setup in under 30 minutes.',
  },
  {
    n:     '02',
    title: '7-Day Full Trial',
    body:  'Every feature unlocked from day one. Add your guards, sites, and clients. Run a real payroll cycle before committing.',
  },
  {
    n:     '03',
    title: 'Get Licensed & Go Live',
    body:  'Talk to us. We configure your payroll rules, import your data, and issue your licence. Most companies are fully live within a day.',
  },
]

const compliance = [
  'Namibian Labour Act (Ch. 11:11)',
  'Social Security Commission contributions',
  'PAYE brackets (2024–2026)',
  'Public holiday roster rules',
  'Overtime thresholds & premiums',
  'Leave accrual & payout rules',
]

const stats = [
  { value: '1,000+', label: 'Guards managed'    },
  { value: '< 30 min', label: 'Average setup time' },
  { value: '3',       label: 'Countries supported' },
  { value: '99.9%',   label: 'Uptime SLA'          },
]

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative bg-secondary overflow-hidden pt-28 pb-0 px-4 sm:px-6 lg:px-8">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          {/* <div aria-hidden className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl pointer-events-none" /> */}

          <div className="relative max-w-5xl mx-auto text-center pt-8">
            {/* Badges */}
            {/* <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-primary/15 border border-primary/30 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                <Shield className="w-3 h-3" /> Built for African Security Companies
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/8 border border-white/15 text-white/60 text-xs font-medium px-3 py-1.5 rounded-full">
                <Package className="w-3 h-3" /> Powered by Odoo 19 Community
              </span>
            </div> */}

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.06] tracking-tight text-balance mb-6">
              The Operating System<br className="hidden sm:block" />
              <span className="text-primary"> Built for Security.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed">
              Replace your roster spreadsheet, payroll Excel file, and manual invoices with one
              platform your whole team can use — from Windhoek to anywhere.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link href="/start">
                <Button size="lg" className="gap-2 shadow-glow">
                  Book a Free Demo <PhoneCall className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#screenshots">
                <Button size="lg" variant="outline"
                  className="text-white border-white/25 hover:bg-white/10 hover:border-white/40 hover:text-white">
                  See It In Action <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <p className="text-xs text-white/35 mb-10">
              7-day free trial · No credit card · Full access from day one
            </p>
          </div>

          {/* Real screenshot */}
          <div className="relative max-w-6xl mx-auto">
            <div className="rounded-t-2xl border-x border-t border-white/10 bg-white/5 backdrop-blur overflow-hidden shadow-2xl">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 px-5 py-3 bg-black/20 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
                <div className="flex-1 mx-6 bg-white/10 rounded-md px-3 py-1 text-xs text-white/30">
                  dogforce.deployguard.io
                </div>
              </div>
              <div className="relative w-full" style={{ aspectRatio: '16/7' }}>
                <Image
                  src="/screenshots/executive-dashboard.png"
                  alt="DeployGuard OS Executive Dashboard"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        <section className="py-12 border-b border-border bg-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-extrabold text-primary">{value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pain points ───────────────────────────────────────────────────── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Sound Familiar?</p>
              <h2 className="text-4xl font-extrabold text-foreground mb-4">
                Running security on spreadsheets is costing you.
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every security company we speak to is dealing with the same three problems.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {painPoints.map(({ icon, title, body }) => (
                <div key={title} className="border border-border rounded-2xl p-7 bg-card hover:shadow-card-hover transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                    {icon}
                  </div>
                  <h3 className="font-bold text-foreground text-base mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Screenshot showcase ──────────────────────────────────────────────── */}
        <section id="screenshots" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto mb-14 text-center">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">See It In Action</p>
            <h2 className="text-4xl font-extrabold text-foreground mb-4">Real screens. Real workflows.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every view below is live inside the running system — not a mockup.
            </p>
          </div>
          <ScreenshotShowcase />
        </section>

        {/* ── Features ──────────────────────────────────────────────────────── */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Platform Features</p>
              <h2 className="text-4xl font-extrabold text-foreground mb-4">Six tools. One platform.</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                DeployGuard OS replaces your scheduling app, payroll spreadsheet, attendance register,
                invoicing tool, equipment log, and HR system — all in one.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map(({ icon, title, body }) => (
                <div key={title} className="bg-card border border-border rounded-2xl p-6 hover:shadow-card-hover transition-shadow group">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <span className="text-primary group-hover:text-primary-foreground transition-colors">{icon}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Mobile App ────────────────────────────────────────────────────── */}
        <MobileAppSection />

        {/* ── AI Engine Callout ──────────────────────────────────────────────── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary via-secondary to-[#0b1329] text-white relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="max-w-2xl text-left">
              <span className="inline-flex items-center gap-1.5 bg-primary/15 border border-primary/30 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Introducing DeployGuard AI
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Operational intelligence, built directly into Odoo.
              </h2>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
                Not a standalone chatbot, but a deep layer of intelligence embedded into your daily screens. 
                From automated attendance audits and billing checks to shift optimization and progressive discipline advisors.
              </p>
              <div className="flex gap-4">
                <Link href="/ai">
                  <Button variant="primary" className="gap-2 shadow-glow">
                    Explore AI Features <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/start">
                  <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 hover:text-white">
                    Book a Free Demo
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* AI Floating Card Preview */}
            <div className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur font-mono text-[11px] text-white/90">
              <div className="flex items-center gap-2 mb-3 text-primary">
                <Bot className="w-4 h-4" />
                <span className="font-semibold uppercase tracking-wider">Smart Shift Fill</span>
              </div>
              <p className="italic mb-3">"Guard L. Nghipandulwa called in sick for tomorrow's shift at Site Alpha."</p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 space-y-2">
                <p className="font-bold text-[10px] text-white/50">TOP REPLACEMENT RECS:</p>
                <p className="text-green-400">1. T. Shikongo (Grade A, Rel: 91/100)</p>
                <p className="text-white/70">2. S. Hamukoto (Grade B, Rel: 88/100)</p>
                <p className="text-white/70">3. J. Nangolo (Grade B, Rel: 85/100)</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Odoo disclosure ──────────────────────────────────────────────────── */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-secondary/5 border-y border-border">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0">
              <Package className="w-7 h-7 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground mb-1">Built on Odoo 19 Community</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DeployGuard OS is a suite of custom Odoo modules — not a standalone SaaS app.{' '}
                <strong className="text-foreground">It requires a running Odoo 19 Community instance.</strong>{' '}
                We host everything for you (Full SaaS), or install the modules on your existing Odoo
                infrastructure (Enterprise App License). Either way you get the same platform — we handle
                all the technical complexity.
              </p>
            </div>
            <a href="https://odoo.com/page/community" target="_blank" rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary underline whitespace-nowrap shrink-0 transition-colors">
              What is Odoo? →
            </a>
          </div>
        </section>

        {/* ── How it works ──────────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Getting Started</p>
              <h2 className="text-4xl font-extrabold text-foreground mb-4">Up and running in one day.</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We handle the setup so you can focus on running your company.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map(({ n, title, body }) => (
                <div key={n}>
                  <div className="text-6xl font-extrabold text-primary/10 leading-none mb-4">{n}</div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            {/* Self-host CTA */}
            <div className="mt-14 bg-secondary rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-white">
                <p className="font-bold text-lg mb-1">Want to self-host?</p>
                <p className="text-white/60 text-sm max-w-md">
                  Download the Docker Compose package and run DeployGuard OS on your own server.
                  Ideal for companies with existing IT infrastructure.
                </p>
              </div>
              <a href="mailto:hello@deployguard.io?subject=Self-Host Download Request" className="shrink-0">
                <Button className="gap-2 whitespace-nowrap">
                  <Download className="w-4 h-4" /> Request Download
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* ── Africa compliance ─────────────────────────────────────────────── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Local Compliance</p>
              <h2 className="text-4xl font-extrabold text-white mb-5 leading-tight">
                Built for Namibia.<br />Ready for the region.
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-8">
                Most HR software treats Africa as an afterthought. DeployGuard OS was built here —
                with Namibian payroll rules, local labour law, and Southern African compliance
                baked into the core, not bolted on as a workaround.
              </p>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-white/60">
                  Zambia, South Africa, and Botswana localization packs coming in 2025.
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {compliance.map((item) => (
                <li key={item} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm text-white/80 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Pricing ───────────────────────────────────────────────────────── */}
        <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Pricing</p>
              <h2 className="text-4xl font-extrabold text-foreground mb-4">Simple, honest pricing.</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Start with a 7-day free trial. After that, we&apos;ll find a plan that fits your guard
                count and budget. No hidden fees, no lock-in.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Starter', limit: 'Up to 50 guards',
                  desc: 'Essentials for growing security teams.',
                  features: ['Roster management', 'Mobile GPS check-in', 'Payroll & compliance', 'Invoicing & billing'],
                  highlight: false, badge: null,
                },
                {
                  name: 'Professional', limit: 'Up to 250 guards',
                  desc: 'Full operational control for established companies.',
                  features: ['Everything in Starter', 'Equipment & fleet tracking', 'Advanced payroll modules', 'Reporting & analytics'],
                  highlight: true, badge: 'Most Popular',
                },
                {
                  name: 'Enterprise', limit: 'Unlimited guards',
                  desc: 'Large operations or existing Odoo users.',
                  features: ['Everything in Professional', 'AI shift planner', 'REST API access', 'Enterprise App License'],
                  highlight: false, badge: null,
                },
              ].map(({ name, limit, desc, features, highlight, badge }) => (
                <div key={name} className={`relative flex flex-col rounded-2xl border p-7 ${
                  highlight ? 'border-primary bg-secondary text-white shadow-xl scale-[1.02]' : 'border-border bg-card'
                }`}>
                  {badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">{badge}</span>
                    </div>
                  )}
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${highlight ? 'text-white/50' : 'text-muted-foreground'}`}>{name}</p>
                  <p className="text-sm font-semibold text-primary mb-4">{limit}</p>
                  <p className={`text-sm mb-6 leading-relaxed flex-1 ${highlight ? 'text-white/60' : 'text-muted-foreground'}`}>{desc}</p>
                  <ul className="space-y-2.5 mb-8">
                    {features.map((f) => (
                      <li key={f} className={`flex items-center gap-2.5 text-sm ${highlight ? 'text-white/80' : 'text-foreground'}`}>
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/start">
                    <Button variant={highlight ? 'primary' : 'outline'} className="w-full justify-center">Get in Touch</Button>
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
              All plans include a 7-day free trial with full access.{' '}
              <Link href="/pricing" className="text-primary hover:underline font-medium">Compare all features →</Link>
            </p>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold text-primary-foreground mb-4">
              Ready to see it in action?
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-10 leading-relaxed">
              Book a 30-minute demo. We&apos;ll walk through your specific setup — your sites, your
              guard count, your payroll rules — using real data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/start">
                <Button variant="secondary" size="lg" className="gap-2">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="mailto:hello@deployguard.io">
                <Button size="lg"
                  className="bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 hover:bg-primary-foreground/20">
                  Email Us Directly
                </Button>
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

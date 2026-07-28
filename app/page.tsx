import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import ScreenshotShowcase from '@/components/ScreenshotShowcase'
import { MobileAppSection } from '@/components/home/MobileAppSection'
import { RoiCalculator } from '@/components/home/RoiCalculator'
import { RegionalMoat } from '@/components/home/RegionalMoat'
import {
  CalendarDays, DollarSign, MapPin, FileText, Wrench, Sparkles,
  ArrowRight, CheckCircle2, AlertTriangle, TrendingDown, Clock,
  Shield, Globe, PhoneCall, MessageSquareCode, ShieldAlert, Cpu
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'DeployGuard OS — Intelligent Workforce & Security Operations Platform',
  description:
    'Replace roster spreadsheets, payroll errors, and ghost guards. Explainable AI guard scoring, hard compliance gates, WhatsApp field check-ins, Namibian & Zambian statutory payroll, and ZRA Smart Invoicing.',
  alternates: { canonical: 'https://deployguard.io' },
  openGraph: {
    title: 'DeployGuard OS — The Operating System Built for Security',
    description: 'Explainable AI guard scoring, hard compliance gates, WhatsApp check-ins, and multi-country payroll compliance.',
    url: 'https://deployguard.io',
    images: [{ url: '/screenshots/executive-dashboard.png', width: 1280, height: 720 }],
  },
}

/* ─── Data ────────────────────────────────────────────────────────────────── */

const painPoints = [
  {
    icon:  <AlertTriangle className="w-5 h-5 text-amber-500" />,
    title: 'Ghost Guards & Payroll Fraud',
    body:  'Supervisors sign off on paper timesheets for guards who never turned up. Manual sheets are impossible to audit, draining 3%–8% of gross revenue in wage leakage.',
  },
  {
    icon:  <Clock className="w-5 h-5 text-amber-500" />,
    title: 'Roster Chaos & Favoritism',
    body:  'Matching guards to post requirements across multiple sites takes days in Excel. Supervisors pick favorites, leading to burnout, understaffing, and client complaints.',
  },
  {
    icon:  <TrendingDown className="w-5 h-5 text-amber-500" />,
    title: 'Statutory Payroll & Midnight Shift Splits',
    body:  'Calculating 12-hour shifts crossing midnight into Normal, Night, Sunday, and Public Holiday rates creates endless calculation errors and labor union disputes.',
  },
]

const features = [
  {
    icon:  <CalendarDays className="w-5 h-5 text-primary" />,
    title: 'Explainable AI Guard Scoring',
    body:  'Zero black boxes. Every guard match displays an explicit score_breakdown evaluating reliability (85/100), site familiarity (+20), grade bonus (+10), and shift fairness.',
  },
  {
    icon:  <ShieldAlert className="w-5 h-5 text-primary" />,
    title: 'Hard Compliance Gates',
    body:  'Enforced risk reduction. Disqualified guards, expired firearm certs, site exclusions, or approved leave requests are physically blocked from taking shifts.',
  },
  {
    icon:  <MessageSquareCode className="w-5 h-5 text-primary" />,
    title: 'WhatsApp Field AI Assistant',
    body:  'Supervisors record site rosters, report AWOL guards, and request replacements directly on WhatsApp. Connected to an in-Odoo live dispatcher workspace.',
  },
  {
    icon:  <DollarSign className="w-5 h-5 text-primary" />,
    title: 'Multi-Country Statutory Payroll',
    body:  'Built-in compliance for Namibia (PAYE, SSC N$108 cap) and Zambia (NAPSA, NHIMA, WCF, PAYE) with direct loan and equipment damage deductions.',
  },
  {
    icon:  <FileText className="w-5 h-5 text-primary" />,
    title: 'ZRA Smart Invoice & Billing Proof',
    body:  'Auto-generate invoices directly from verified site attendance. Includes native ZRA Smart Invoice VSDC fiscal signing and client attendance proof reports.',
  },
  {
    icon:  <Wrench className="w-5 h-5 text-primary" />,
    title: 'Equipment & Fleet Management',
    body:  'Track radios, firearms, uniforms, and shuttle runs. Automatic damage claims deduct directly from payslips without extra manual paperwork.',
  },
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative bg-secondary overflow-hidden pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          <div className="relative max-w-5xl mx-auto text-center pt-8">
            {/* Regional Badges */}
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-primary/20 border border-primary/30 text-primary-light text-xs font-semibold px-3 py-1.5 rounded-full">
                <Shield className="w-3.5 h-3.5" /> Built for African Security Companies
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full">
                🇳🇦 Namibia PAYE & SSC
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full">
                🇿M Zambia NAPSA & ZRA Smart Invoice
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-full">
                💬 WhatsApp Field Bridge
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight text-balance mb-6">
              Stop Losing Profits to Roster Chaos,<br className="hidden sm:block" />
              <span className="text-primary"> Ghost Guards, and Payroll Errors.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/75 max-w-3xl mx-auto mb-10 leading-relaxed">
              DeployGuard is the intelligent operating system for private security companies. Auto-plan compliant rosters with explainable AI scoring, verify field attendance via Mobile or WhatsApp, and run 100% compliant statutory payroll in under 5 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link href="/start">
                <Button size="lg" className="gap-2 shadow-glow text-base px-8 py-4">
                  Request a 15-Min Live Demo <PhoneCall className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#calculator">
                <Button size="lg" variant="outline"
                  className="text-white border-white/25 hover:bg-white/10 hover:border-white/40 hover:text-white text-base">
                  Calculate Revenue Leakage <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <p className="text-xs text-white/40 mb-12">
              Free 30-minute operational audit included · Full setup support in Namibia & Zambia
            </p>
          </div>

          {/* Hero Main Screenshot Frame */}
          <div className="relative max-w-6xl mx-auto">
            <div className="rounded-t-2xl border-x border-t border-white/15 bg-white/5 backdrop-blur overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-5 py-3 bg-black/40 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                <div className="flex-1 mx-6 bg-white/10 rounded-md px-3 py-1 text-xs text-white/40 font-mono">
                  dogforce.deployguard.io/web#action=security_reporting
                </div>
              </div>
              <div className="relative w-full" style={{ aspectRatio: '16/8' }}>
                <Image
                  src="/screenshots/Attendance-Summary-Grid.png"
                  alt="DeployGuard OS Attendance Summary Grid"
                  fill
                  className="object-contain object-top bg-slate-950/90 p-1"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Pain Points Section ───────────────────────────────────────────── */}
        <section className="py-20 bg-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl font-extrabold text-foreground mb-4">
                The Security Industry's Costliest Operational Traps
              </h2>
              <p className="text-muted-foreground text-base">
                Managing guards across dozens of sites with paper timesheets and Excel leads to severe revenue loss, client disputes, and statutory fines.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {painPoints.map((p, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Screenshots Showcase ────────────────────────────────────────── */}
        <section id="screenshots" className="py-24 bg-muted/30 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
            <span className="text-xs uppercase font-bold text-primary tracking-widest block mb-2">
              Inside DeployGuard OS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Built for Speed, Compliance, and Total Field Control
            </h2>
          </div>
          <div className="px-4 sm:px-6 lg:px-8">
            <ScreenshotShowcase />
          </div>
        </section>

        {/* ── Features Grid ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-background border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
                Every Module Built for Private Security Requirements
              </h2>
              <p className="text-muted-foreground text-lg">
                Not a generic ERP configuration. Purpose-built security operations tools engineered to eliminate administrative overhead.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/40 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Regional Moat Section ────────────────────────────────────────── */}
        <RegionalMoat />

        {/* ── Mobile App & WhatsApp Section ───────────────────────────────── */}
        <MobileAppSection />

        {/* ── Interactive ROI Calculator ───────────────────────────────────── */}
        <div id="calculator">
          <RoiCalculator />
        </div>

        {/* ── Final Call to Action ──────────────────────────────────────────── */}
        <section className="py-20 bg-primary text-secondary relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight">
              Ready to Transform Your Security Operations?
            </h2>
            <p className="text-lg sm:text-xl text-secondary/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              Book a live 15-minute demonstration with our Southern Africa operations specialists and see how DeployGuard can streamline your firm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/start">
                <Button size="lg" className="bg-secondary text-white hover:bg-slate-900 text-base px-8 py-4 shadow-xl">
                  Schedule My Live Demo <PhoneCall className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

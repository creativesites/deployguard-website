import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import { CheckCircle2, Minus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing — DeployGuard OS',
  description:
    'Simple, honest pricing for security companies of every size. Start with a free trial. Starter, Professional, and Enterprise plans with no hidden fees.',
  alternates: { canonical: 'https://deployguard.io/pricing' },
  openGraph: {
    title: 'DeployGuard OS Pricing — Simple Plans for Security Companies',
    description: 'Roster, statutory payroll, GPS attendance, and AI features — find the plan that fits your guard count.',
    url: 'https://deployguard.io/pricing',
    images: [{ url: '/screenshots/executive-dashboard.png', width: 1280, height: 720 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeployGuard OS Pricing',
    description: 'Free trial. No credit card. Full access from day one.',
    images: ['/screenshots/executive-dashboard.png'],
  },
}


const tiers = [
  {
    name:       'Starter',
    guardLimit: 'Up to 50 guards',
    description:'Essentials for growing security teams.',
    features:   ['Roster management & guard matching', 'Mobile GPS check-in', 'Namibia & Zambia statutory payroll', 'Client invoicing & billing', 'Document expiry tracking', '7-day free trial'],
    cta:        'Request a Demo',
    highlighted: false,
  },
  {
    name:       'Professional',
    guardLimit: 'Up to 250 guards',
    description:'Full operational control for established security firms.',
    features:   ['Everything in Starter', 'Explainable Guard Scoring (score_breakdown)', 'Hard Compliance Gates (enforced risk reduction)', 'WhatsApp Field AI Assistant', 'Equipment & firearms tracking', 'Fleet management & shuttle runs', 'Leave, loans & disciplinary fines', 'DeployGuard AI Engine', 'Priority regional support'],
    cta:        'Request a Demo',
    highlighted: true,
    badge:      'Most Popular',
  },
  {
    name:       'Enterprise',
    guardLimit: 'Unlimited guards',
    description:'For large operations or multi-country security enterprises.',
    features:   ['Everything in Professional', 'ZRA Smart Invoice VSDC native integration', 'DeployGuard AI Engine & custom tuning', 'REST API access', 'Custom localization packs & reports', 'Enterprise App License option', 'Dedicated implementation manager', 'Custom SLA & 24/7 hotline'],
    cta:        'Contact Us',
    highlighted: false,
  },
]

type CellVal = boolean | string
type Row = { label: string; starter: CellVal; professional: CellVal; enterprise: CellVal }

const rows: Row[] = [
  { label: 'Guard headcount limit',       starter: '50 Guards', professional: '250 Guards', enterprise: 'Unlimited'   },
  { label: 'Client sites & posts',       starter: true,        professional: true,        enterprise: true          },
  { label: 'Roster management',          starter: true,        professional: true,        enterprise: true          },
  { label: 'Explainable Guard Scoring',  starter: false,       professional: true,        enterprise: true          },
  { label: 'Hard Compliance Gates',      starter: true,        professional: true,        enterprise: true          },
  { label: 'Mobile app (GPS check-in)',  starter: true,        professional: true,        enterprise: true          },
  { label: 'WhatsApp Field AI Assistant',starter: false,       professional: true,        enterprise: true          },
  { label: 'Statutory Payroll (NA & ZM)',starter: true,        professional: true,        enterprise: true          },
  { label: 'Automatic Midnight Shift Split',starter: true,     professional: true,        enterprise: true          },
  { label: 'ZRA Smart Invoice Integration',starter: false,     professional: true,        enterprise: true          },
  { label: 'Invoicing & client proof',   starter: true,        professional: true,        enterprise: true          },
  { label: 'Equipment & firearms',       starter: false,       professional: true,        enterprise: true          },
  { label: 'Fleet & shuttle runs',       starter: false,       professional: true,        enterprise: true          },
  { label: 'Leave, loans & discipline',  starter: false,       professional: true,        enterprise: true          },
  { label: 'DeployGuard AI Engine',      starter: false,       professional: 'Included',  enterprise: 'Included'    },
  { label: 'REST API access',            starter: false,       professional: false,       enterprise: true          },
  { label: 'Dedicated Support',          starter: 'Email',     professional: 'Priority',  enterprise: '24/7 Dedicated'},
]

function Cell({ value }: { value: CellVal }) {
  if (typeof value === 'string') return <span className="text-sm font-medium text-foreground">{value}</span>
  return value
    ? <CheckCircle2 className="w-4 h-4 text-primary mx-auto" />
    : <Minus className="w-4 h-4 text-border mx-auto" />
}

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Pricing</p>
            <h1 className="text-5xl font-extrabold text-foreground mb-4">Simple, honest pricing.</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start with a free trial. We&apos;ll configure your local payroll rules, import your guards, and get you running in hours. No hidden fees.
            </p>
          </div>

          {/* Tier cards */}
          <div className="grid md:grid-cols-3 gap-6 items-start mb-20">
            {tiers.map(({ name, guardLimit, description, features, cta, highlighted, badge }) => (
              <div key={name} className={`relative flex flex-col rounded-2xl border p-8 ${
                highlighted
                  ? 'border-primary bg-secondary text-white shadow-xl scale-[1.02]'
                  : 'border-border bg-card'
              }`}>
                {badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {badge}
                    </span>
                  </div>
                )}

                <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${highlighted ? 'text-white/50' : 'text-muted-foreground'}`}>
                  {name}
                </p>
                <p className={`text-sm font-semibold mb-1 ${highlighted ? 'text-primary' : 'text-primary'}`}>
                  {guardLimit}
                </p>
                <p className={`text-sm mb-6 leading-relaxed ${highlighted ? 'text-white/60' : 'text-muted-foreground'}`}>
                  {description}
                </p>

                <ul className="space-y-2.5 flex-1 mb-8">
                  {features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${highlighted ? 'text-white/80' : 'text-foreground'}`}>
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/start">
                  <Button
                    variant={highlighted ? 'primary' : 'outline'}
                    className="w-full justify-center"
                  >
                    {cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <h2 className="text-2xl font-extrabold text-foreground mb-6">Full feature comparison</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-4 text-muted-foreground font-medium w-1/2">Operational Feature</th>
                  <th className="pb-4 text-center font-semibold text-foreground">Starter</th>
                  <th className="pb-4 text-center font-semibold text-primary">Professional</th>
                  <th className="pb-4 text-center font-semibold text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 text-foreground">{row.label}</td>
                    <td className="py-3 text-center"><Cell value={row.starter} /></td>
                    <td className="py-3 text-center bg-primary/5"><Cell value={row.professional} /></td>
                    <td className="py-3 text-center"><Cell value={row.enterprise} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center bg-muted/40 rounded-2xl p-10">
            <h3 className="text-2xl font-extrabold text-foreground mb-2">Not sure which plan fits?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Tell us your guard count and country, and we&apos;ll tailor the setup to your security operations.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/start"><Button size="lg">Request a Demo</Button></Link>
              <a href="mailto:hello@deployguard.io">
                <Button size="lg" variant="outline">Email Us</Button>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

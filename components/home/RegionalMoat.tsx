import { Check, X, Shield, Cpu, MessageSquare, Building2 } from 'lucide-react'

export function RegionalMoat() {
  const comparison = [
    {
      feature: 'Explainable Guard Scoring (score_breakdown)',
      description: 'Shows transparent point calculation (reliability, grade, site familiarity, fairness penalty)',
      deployguard: true,
      generic: false,
    },
    {
      feature: 'Hard Compliance Gates (Enforced, Not Warnings)',
      description: 'Physically blocks assignment if certs are expired, guard is excluded, or on approved leave',
      deployguard: true,
      generic: false,
    },
    {
      feature: 'WhatsApp AI Conversational Field Bridge',
      description: 'Supervisors check in site rosters, report AWOL guards, & request shift replacements on WhatsApp',
      deployguard: true,
      generic: false,
    },
    {
      feature: 'Namibian Statutory Payroll (PAYE & SSC Caps)',
      description: 'Built-in SSC N$108/mo caps, public holiday overtime multipliers, & Namibian Labour Act rules',
      deployguard: true,
      generic: false,
    },
    {
      feature: 'Zambian Statutory Payroll (NAPSA, NHIMA & WCF)',
      description: 'NAPSA annual cap rules, NHIMA 0.5% + 0.5% split, WCF levy, & pre-tax NAPSA deductibility',
      deployguard: true,
      generic: false,
    },
    {
      feature: 'ZRA Smart Invoice Native Fiscal VSDC Signing',
      description: 'Direct submission to Zambia Revenue Authority VSDC with QR code & backoff retry crons',
      deployguard: true,
      generic: false,
    },
    {
      feature: 'Automatic Midnight Shift Hour Bucket Splitting',
      description: 'Converts 12-hour shifts into Normal, Night (18:00-06:00), Saturday, Sunday, & Holiday buckets',
      deployguard: true,
      generic: false,
    },
  ]

  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <Building2 className="w-3.5 h-3.5" /> Built Specifically for Southern Africa
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Why Generic ERPs & Scheduling Apps Fall Short
          </h2>
          <p className="text-muted-foreground text-lg">
            International apps don't understand African labor laws, shift splits across midnight, or regional tax compliance. DeployGuard works out of the box with zero custom development.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
          <div className="grid grid-cols-12 bg-muted/60 p-4 sm:p-6 text-sm font-bold border-b border-border items-center">
            <div className="col-span-6 sm:col-span-7 text-foreground">Core Operational & Statutory Capabilities</div>
            <div className="col-span-3 sm:col-span-2 text-center text-muted-foreground">Generic ERPs / Deputy</div>
            <div className="col-span-3 sm:col-span-3 text-center text-primary font-black">DeployGuard OS</div>
          </div>

          <div className="divide-y divide-border">
            {comparison.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 p-4 sm:p-6 text-sm items-center hover:bg-muted/30 transition-colors">
                <div className="col-span-6 sm:col-span-7 pr-2">
                  <div className="font-semibold text-foreground">{item.feature}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{item.description}</div>
                </div>
                <div className="col-span-3 sm:col-span-2 flex justify-center text-muted-foreground/50">
                  {item.generic ? (
                    <Check className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/30" />
                  )}
                </div>
                <div className="col-span-3 sm:col-span-3 flex justify-center">
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 font-bold px-2.5 py-1 rounded-full text-xs">
                    <Check className="w-4 h-4 text-emerald-600" /> Built-In
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

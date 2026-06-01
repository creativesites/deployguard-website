'use client'

import { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import {
  LayoutDashboard, CalendarDays, DollarSign,
  ClipboardList, FileText, Wrench,
} from 'lucide-react'

const tabs = [
  {
    id:      'dashboard',
    label:   'Overview',
    icon:    <LayoutDashboard className="w-4 h-4" />,
    heading: 'Your whole operation at a glance.',
    body:    'The Executive Dashboard surfaces what matters right now — active guards, present today, AWOL alerts, unassigned slots, and pending invoices — all on one screen. No digging through reports.',
    img:     '/screenshots/executive-dashboard.png',
    alt:     'DeployGuard OS Executive Dashboard showing live operational KPIs',
    ready:   true,
  },
  {
    id:      'roster',
    label:   'Roster Board',
    icon:    <CalendarDays className="w-4 h-4" />,
    heading: 'Every post filled. Every shift confirmed.',
    body:    'The Roster Board assigns guards to posts across the week on a live calendar. Day shifts, night shifts, multiple sites — confirmed in colour, unassigned flagged immediately. Fairness warnings stop over-rostering before it happens.',
    img:     '/screenshots/roaster-batch.png',
    alt:     'DeployGuard OS Roster Board showing weekly guard assignments across sites',
    ready:   true,
  },
  {
    id:      'payroll',
    label:   'Payroll',
    icon:    <DollarSign className="w-4 h-4" />,
    heading: 'Every pay run. Every rate. Correct.',
    body:    'The Payroll Command Center processes each period automatically — normal time, overtime, Saturday, Sunday, public holiday, and night rates. Bulk confirm all drafts in one click, mark as paid, print batch reports.',
    img:     '/screenshots/payroll-command-center.png',
    alt:     'DeployGuard OS Payroll Command Center showing payslips and period summary',
    ready:   true,
  },
  {
    id:      'slots',
    label:   'Shift Management',
    icon:    <ClipboardList className="w-4 h-4" />,
    heading: 'Every slot. Every guard. Every shift.',
    body:    'Roster Slots give you a detailed log of every assigned shift — client site, post, shift template, employee, and confirmation status. Filter by date, site, or batch. Full audit trail included.',
    img:     '/screenshots/roaster-slots.png',
    alt:     'DeployGuard OS Roster Slots list showing all shift assignments',
    ready:   true,
  },
  {
    id:      'billing',
    label:   'Billing',
    icon:    <FileText className="w-4 h-4" />,
    heading: 'Invoices that write themselves.',
    body:    'Client invoices are generated directly from real attendance and roster data. Actual hours. Actual guards. Actual rates. Send branded PDFs in seconds — disputes disappear when the data is right.',
    img:     '/screenshots/billing-invoices.png',
    alt:     'DeployGuard OS billing invoices view',
    ready:   false,
  },
  {
    id:      'equipment',
    label:   'Equipment',
    icon:    <Wrench className="w-4 h-4" />,
    heading: 'Every firearm. Every radio. Accounted for.',
    body:    'Track serialised equipment from issue to return. Firearm license expiry alerts keep you legally compliant. No guard disappears with company property when every item is logged to a name.',
    img:     '/screenshots/equipment-tracking.png',
    alt:     'DeployGuard OS equipment tracking view',
    ready:   false,
  },
]

export default function ScreenshotShowcase() {
  const [active, setActive] = useState(tabs[0].id)
  const tab = tabs.find((t) => t.id === active)!

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab bar */}
      <div className="flex overflow-x-auto gap-1 p-1 bg-muted rounded-2xl mb-10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center relative',
              active === t.id
                ? 'bg-secondary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background'
            )}
          >
            {t.icon}
            <span className="hidden sm:block">{t.label}</span>
            {!t.ready && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-muted-foreground/40" title="Screenshot coming soon" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-5 gap-10 items-center">
        {/* Text side */}
        <div className="md:col-span-2 order-2 md:order-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
            {tab.icon}
          </div>
          <h3 className="text-2xl font-extrabold text-foreground mb-3 leading-snug">{tab.heading}</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">{tab.body}</p>
        </div>

        {/* Screenshot side */}
        <div className="md:col-span-3 order-1 md:order-2 rounded-2xl border border-border overflow-hidden shadow-card-hover bg-muted/20" style={{ aspectRatio: '16/9' }}>
          <div className="relative w-full h-full">
            {tab.ready ? (
              <Image
                src={tab.img}
                alt={tab.alt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  {tab.icon}
                </div>
                <p className="text-xs font-medium">{tab.label} screenshot coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

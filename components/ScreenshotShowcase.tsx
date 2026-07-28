'use client'

import { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import {
  LayoutDashboard, CalendarDays, DollarSign,
  ClipboardList, AlertTriangle, HelpCircle, Truck,
  ClipboardCheck, ShieldAlert, MessageSquareCode,
  FileCheck2, Building2, Layers, Sparkles
} from 'lucide-react'

interface GalleryItem {
  img: string
  caption: string
}

interface Tab {
  id:       string
  label:    string
  icon:     React.ReactNode
  heading:  string
  body:     string
  img:      string
  alt:      string
  gallery?: GalleryItem[]
}

const tabs: Tab[] = [
  {
    id:      'dashboard',
    label:   'Executive Dashboard',
    icon:    <LayoutDashboard className="w-4 h-4" />,
    heading: 'Your whole operation at a glance.',
    body:    'Real-time operational KPIs — active guards, posts present today, AWOL alerts, critical gaps, and unbilled revenue — all on one central screen.',
    img:     '/screenshots/executive-dashboard.png',
    alt:     'DeployGuard OS Executive Dashboard showing live operational KPIs',
  },
  {
    id:      'rostering',
    label:   'Rostering Hub',
    icon:    <CalendarDays className="w-4 h-4" />,
    heading: 'AI Rostering & Explainable Guard Scoring',
    body:    'Zero black boxes. Every guard match displays an explicit score_breakdown evaluating reliability, site familiarity, grade requirements, fairness penalties, and AWOL history.',
    img:     '/screenshots/explainable-scoring.png',
    alt:     'DeployGuard OS Explainable Guard Scoring and Roster Board',
    gallery: [
      { img: '/screenshots/explainable-scoring.png', caption: 'Explainable Scoring' },
      { img: '/screenshots/rostering-hub-dashboard.png', caption: 'Rostering Hub' },
      { img: '/screenshots/rostering-hub-monthly-roster.png', caption: 'Monthly Roster' },
    ],
  },
  {
    id:      'attendance',
    label:   'Attendance Console',
    icon:    <ClipboardCheck className="w-4 h-4" />,
    heading: 'Posting Console, Summary Grid & Heatmaps',
    body:    'Record guard arrival/departure in seconds. Features full Attendance Summary Grids, historical logs, and site heatmaps to spot late patterns and absenteeism instantly.',
    img:     '/screenshots/posting-console.png',
    alt:     'DeployGuard OS Posting Console and Attendance Summary Grid',
    gallery: [
      { img: '/screenshots/posting-console.png', caption: 'Posting Console' },
      { img: encodeURI('/screenshots/Attendance-Summary-Grid.png'), caption: 'Summary Grid' },
      { img: encodeURI('/screenshots/Attendance Heatmap.png'), caption: 'Attendance Heatmap' },
      { img: encodeURI('/screenshots/Attendance History.png'), caption: 'Attendance History' },
    ],
  },
  {
    id:      'payroll',
    label:   'Statutory Payroll',
    icon:    <DollarSign className="w-4 h-4" />,
    heading: 'Payroll Command Center & Payslip Designer',
    body:    'Built for Namibia (PAYE, SSC) and Zambia (NAPSA, NHIMA, WCF, PAYE). Auto-splits 12-hour shifts across midnight with custom QWeb Payslip Designer tools.',
    img:     '/screenshots/Payroll-Command-Center.png',
    alt:     'DeployGuard OS Payroll Command Center and Payslip Breakdown',
    gallery: [
      { img: '/screenshots/Payroll-Command-Center.png', caption: 'Command Center' },
      { img: '/screenshots/statutory-payslip-breakdown.png', caption: 'Payslip Breakdown' },
      { img: '/screenshots/Payslip-Designer.png', caption: 'Payslip Designer' },
    ],
  },
  {
    id:      'whatsapp',
    label:   'WhatsApp Field AI',
    icon:    <MessageSquareCode className="w-4 h-4" />,
    heading: 'Field Check-Ins & AI Assistant on WhatsApp',
    body:    'Supervisors record attendance, report AWOL guards, and request replacements directly inside WhatsApp. Includes an in-Odoo live conversational workspace.',
    img:     '/screenshots/whatsapp-ai-workspace.png',
    alt:     'DeployGuard OS WhatsApp AI Field Workspace',
  },
  {
    id:      'billing',
    label:   'ZRA & Client Billing',
    icon:    <Building2 className="w-4 h-4" />,
    heading: 'ZRA Smart Invoice & Client Service Reports',
    body:    'Direct ZRA VSDC API submission with receipt signatures, QR codes, and auto-retry crons. Attach verifiable client service & attendance reports to eliminate invoice disputes.',
    img:     '/screenshots/zra-smart-invoice.png',
    alt:     'DeployGuard OS ZRA Smart Invoice Billing and Client Service Report',
    gallery: [
      { img: '/screenshots/zra-smart-invoice.png', caption: 'ZRA Smart Invoice' },
      { img: '/screenshots/client-service-report.png', caption: 'Client Service Report' },
      { img: '/screenshots/client-onboarding-wizard.png', caption: 'Onboarding Wizard' },
    ],
  },
  {
    id:      'incidents',
    label:   'Discipline & Incidents',
    icon:    <AlertTriangle className="w-4 h-4" />,
    heading: 'Behavioral Incidents & Audit Trails',
    body:    'Log guard behavioral incidents with severity, evidence, and appeals. Deduct disciplinary fines directly from statutory payroll with full audit documentation.',
    img:     '/screenshots/behavioral-incident1.png',
    alt:     'DeployGuard OS Disciplinary Incident Management',
    gallery: [
      { img: '/screenshots/behavioral-incident1.png', caption: 'Incident Detail' },
      { img: '/screenshots/behavioral-incident2.png', caption: 'Incident List' },
      { img: '/screenshots/behavioral-incident3.png', caption: 'Incident Kanban' },
    ],
  },
  {
    id:      'transport',
    label:   'Fleet & Transport',
    icon:    <Truck className="w-4 h-4" />,
    heading: 'Vehicle Runs & Passenger Manifests',
    body:    'Track guard shuttle runs, route schedules, passenger manifests, fuel logs, and pre-departure vehicle inspections in real time.',
    img:     '/screenshots/transport-run.png',
    alt:     'DeployGuard OS Transport Run and Fleet Operations',
  },
  {
    id:      'help',
    label:   'Help Centre',
    icon:    <HelpCircle className="w-4 h-4" />,
    heading: 'Country-Aware In-App Guidance',
    body:    'Embedded OWL Help Centre with searchable articles for Namibia and Zambia operations — from guard onboarding to tax filing.',
    img:     '/screenshots/help-center.png',
    alt:     'DeployGuard OS Built-in Help Centre',
  },
]

export default function ScreenshotShowcase() {
  const [activeId, setActiveId] = useState(tabs[0].id)
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0)

  const tab = tabs.find((t) => t.id === activeId)!

  function handleTabChange(id: string) {
    setActiveId(id)
    setActiveGalleryIdx(0)
  }

  // Get active image from gallery or primary image
  const currentImg = tab.gallery && tab.gallery[activeGalleryIdx]
    ? tab.gallery[activeGalleryIdx].img
    : tab.img

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab bar */}
      <div className="flex overflow-x-auto gap-1.5 p-1.5 bg-muted rounded-2xl mb-8 scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            className={clsx(
              'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center min-w-[110px]',
              activeId === t.id
                ? 'bg-secondary text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
            )}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Text Description & Sub-Gallery Thumbnails */}
        <div className="md:col-span-4 order-2 md:order-1 flex flex-col justify-between h-full">
          <div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
              {tab.icon}
            </div>
            <h3 className="text-2xl font-extrabold text-foreground mb-3 leading-snug">{tab.heading}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{tab.body}</p>
          </div>

          {/* Gallery sub-nav buttons if tab has multiple screenshots */}
          {tab.gallery && tab.gallery.length > 1 && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Module Views ({tab.gallery.length})
              </div>
              <div className="grid grid-cols-3 gap-2">
                {tab.gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveGalleryIdx(i)}
                    className={clsx(
                      'p-1.5 rounded-xl border text-left transition-all text-[11px] font-semibold flex flex-col items-center gap-1',
                      activeGalleryIdx === i
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                        : 'border-border text-muted-foreground hover:border-foreground/30 hover:bg-muted/50'
                    )}
                  >
                    <span className="truncate w-full text-center">{g.caption}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Responsive Framed Screenshot Container */}
        <div className="md:col-span-8 order-1 md:order-2 rounded-2xl border border-border bg-slate-950 overflow-hidden shadow-2xl relative">
          {/* Fake Browser Top Chrome Bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-black/60 border-b border-white/10 text-xs text-white/50">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            <div className="flex-1 mx-4 bg-white/10 rounded px-2.5 py-0.5 font-mono text-[11px] truncate">
              dogforce.deployguard.io/web#{tab.id}
            </div>
          </div>

          {/* Flexible Image Frame - object-contain prevents aspect ratio stretching */}
          <div className="relative w-full bg-slate-950/90 p-2" style={{ aspectRatio: '16/10' }}>
            <Image
              key={currentImg}
              src={currentImg}
              alt={tab.alt}
              fill
              className="object-contain object-top p-1"
              sizes="(max-width: 768px) 100vw, 65vw"
              priority={activeId === tabs[0].id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

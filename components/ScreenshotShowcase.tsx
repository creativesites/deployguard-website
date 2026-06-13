'use client'

import { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import {
  LayoutDashboard, CalendarDays, DollarSign,
  ClipboardList, AlertTriangle, HelpCircle, Truck,
  ClipboardCheck,
} from 'lucide-react'

interface Tab {
  id:       string
  label:    string
  icon:     React.ReactNode
  heading:  string
  body:     string
  img:      string
  alt:      string
  ready:    true
  gallery?: { img: string; caption: string }[]
}

const tabs: Tab[] = [
  {
    id:      'dashboard',
    label:   'Dashboard',
    icon:    <LayoutDashboard className="w-4 h-4" />,
    heading: 'Your whole operation at a glance.',
    body:    'The Executive Dashboard surfaces what matters right now — active guards, present today, AWOL alerts, unassigned slots, and pending invoices — all on one screen. No digging through reports.',
    img:     '/screenshots/dashboard.png',
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
    id:      'attendance',
    label:   'Attendance',
    icon:    <ClipboardCheck className="w-4 h-4" />,
    heading: 'Check-in, check-out — captured instantly.',
    body:    'The Posting Console lets supervisors record every guard\'s arrival and departure in seconds. Late arrivals, early departures, and AWOL statuses are flagged in real time — feeding directly into payroll and reliability scores.',
    img:     '/screenshots/posting-console.png',
    alt:     'DeployGuard OS Posting Console showing daily attendance capture',
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
    label:   'Shift Slots',
    icon:    <ClipboardList className="w-4 h-4" />,
    heading: 'Every slot. Every guard. Every shift.',
    body:    'Roster Slots give you a detailed log of every assigned shift — client site, post, shift template, employee, and confirmation status. Filter by date, site, or batch. Full audit trail included.',
    img:     '/screenshots/roaster-slots.png',
    alt:     'DeployGuard OS Roster Slots list showing all shift assignments',
    ready:   true,
  },
  {
    id:      'incidents',
    label:   'Discipline',
    icon:    <AlertTriangle className="w-4 h-4" />,
    heading: 'Every incident logged. Every decision documented.',
    body:    'Behavioural incidents are captured with severity, evidence, and guard acknowledgment tracked end-to-end. Approvals flow through a structured workflow — appeal, overturn, or uphold — so every disciplinary decision has a defensible paper trail.',
    img:     '/screenshots/behavioral-incident1.png',
    alt:     'DeployGuard OS Behavioural Incident management — incident detail view',
    ready:   true,
    gallery: [
      { img: '/screenshots/behavioral-incident1.png', caption: 'Incident Detail' },
      { img: '/screenshots/behavioral-incident2.png', caption: 'Incident List'   },
      { img: '/screenshots/behavioral-incident3.png', caption: 'Incident Kanban' },
    ],
  },
  {
    id:      'transport',
    label:   'Transport',
    icon:    <Truck className="w-4 h-4" />,
    heading: 'Every vehicle. Every run. On record.',
    body:    'Transport Runs track shuttle routes, passenger manifests, and departure times for every trip. Pre-departure vehicle inspections and fuel logs create a complete fleet history — guards arrive on time and every kilometre is accounted for.',
    img:     '/screenshots/transport-run.png',
    alt:     'DeployGuard OS Transport Run showing shuttle route and passenger manifest',
    ready:   true,
  },
  {
    id:      'help',
    label:   'Help Centre',
    icon:    <HelpCircle className="w-4 h-4" />,
    heading: 'Built-in guidance. No manual required.',
    body:    'The DeployGuard Help Centre is embedded directly in the platform. Beginner-friendly articles explain every module — from adding a guard to running payroll — searchable by keyword and organised by topic.',
    img:     '/screenshots/help-center.png',
    alt:     'DeployGuard OS Help Centre showing categorised how-to articles',
    ready:   true,
  },
]

export default function ScreenshotShowcase() {
  const [activeId,       setActiveId]       = useState(tabs[0].id)
  const [activeGallery,  setActiveGallery]  = useState(0)

  const tab = tabs.find((t) => t.id === activeId)!

  function handleTabChange(id: string) {
    setActiveId(id)
    setActiveGallery(0)
  }

  const currentImg = tab.gallery ? tab.gallery[activeGallery].img : tab.img

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab bar */}
      <div className="flex overflow-x-auto gap-1 p-1 bg-muted rounded-2xl mb-10 scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            className={clsx(
              'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center min-w-[64px]',
              activeId === t.id
                ? 'bg-secondary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background'
            )}
          >
            {t.icon}
            <span className="hidden sm:block">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-5 gap-10 items-start">
        {/* Text side */}
        <div className="md:col-span-2 order-2 md:order-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
            {tab.icon}
          </div>
          <h3 className="text-2xl font-extrabold text-foreground mb-3 leading-snug">{tab.heading}</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">{tab.body}</p>

          {/* Gallery thumbnails for tabs that have multiple screenshots */}
          {tab.gallery && (
            <div className="flex gap-2 mt-6">
              {tab.gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveGallery(i)}
                  className={clsx(
                    'flex-1 rounded-lg overflow-hidden border-2 transition-all',
                    activeGallery === i ? 'border-primary shadow-md' : 'border-border opacity-60 hover:opacity-90'
                  )}
                  title={g.caption}
                >
                  <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                    <Image
                      src={g.img}
                      alt={g.caption}
                      fill
                      className="object-cover object-top"
                      sizes="120px"
                    />
                  </div>
                  <p className="text-[10px] font-medium text-center py-1 bg-muted/60 text-muted-foreground">
                    {g.caption}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Screenshot side */}
        <div
          className="md:col-span-3 order-1 md:order-2 rounded-2xl border border-border overflow-hidden shadow-card-hover bg-muted/20"
          style={{ aspectRatio: '16/9' }}
        >
          <div className="relative w-full h-full">
            <Image
              key={currentImg}
              src={currentImg}
              alt={tab.alt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority={activeId === tabs[0].id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

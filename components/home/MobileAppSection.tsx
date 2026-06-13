'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Smartphone, CheckCircle2, ShieldCheck, Building2, BarChart3,
  Wifi, WifiOff, Fingerprint, RefreshCw, Bell, Download,
  ClipboardList, Users, TrendingUp, ChevronRight, Clock,
  AlertTriangle, DollarSign, MapPin,
} from 'lucide-react'

const roles = [
  {
    id:       'supervisor',
    label:    'Supervisor',
    icon:     ClipboardList,
    tagline:  'Mark attendance from the field',
    color:    'text-blue-400',
    activeBg: 'bg-blue-500',
    features: [
      { icon: ClipboardList, text: 'Live posting sheet — all guards per site'           },
      { icon: CheckCircle2,  text: 'Swipe to mark Present · Absent · AWOL instantly'    },
      { icon: Clock,         text: 'Check-in / check-out timestamps with late detection' },
      { icon: Users,         text: 'Assign replacement guard in seconds for no-shows'   },
      { icon: ClipboardList, text: 'Submit posting sheet batch from the field'           },
      { icon: RefreshCw,     text: 'Full history of past posting sheets'                },
    ],
    mockupTitle: "Today's Posting Sheet",
    mockupSite:  'Shoprite Windhoek West',
    mockupStats: [
      { label: 'Present', value: '8', color: 'bg-green-500' },
      { label: 'Late',    value: '1', color: 'bg-amber-500' },
      { label: 'AWOL',    value: '1', color: 'bg-red-500'   },
    ],
    mockupGuards: [
      { name: 'J. Nghifikepunye', post: 'Main Gate',     status: 'Present', statusColor: 'text-green-400' },
      { name: 'M. Uushona',       post: 'Control Room',  status: 'Late',    statusColor: 'text-amber-400' },
      { name: 'T. Katjiukua',     post: 'Parking Area',  status: 'AWOL',    statusColor: 'text-red-400'   },
      { name: 'P. Mutumba',       post: 'Loading Bay',   status: 'Present', statusColor: 'text-green-400' },
    ],
  },
  {
    id:       'manager',
    label:    'Manager',
    icon:     Building2,
    tagline:  'Oversee all sites at a glance',
    color:    'text-purple-400',
    activeBg: 'bg-purple-500',
    features: [
      { icon: Building2,     text: 'Multi-site attendance dashboard for today'         },
      { icon: BarChart3,     text: 'Per-site rates: total, present, late, absent, AWOL' },
      { icon: ChevronRight,  text: 'Drill into any site for full guard roster'          },
      { icon: CheckCircle2,  text: 'Approve or reject overtime requests on the go'     },
      { icon: Clock,         text: 'Navigate by day — review historical performance'   },
      { icon: AlertTriangle, text: 'Sites ranked by worst attendance flagged first'    },
    ],
    mockupTitle: 'Multi-Site Dashboard',
    mockupSite:  'Today — 4 sites active',
    mockupStats: [
      { label: 'Rate',    value: '91%', color: 'bg-green-500' },
      { label: 'Present', value: '43',  color: 'bg-blue-500'  },
      { label: 'Issues',  value: '4',   color: 'bg-amber-500' },
    ],
    mockupGuards: [
      { name: 'Shoprite Windhoek West', post: '12 guards',  status: '92%', statusColor: 'text-green-400'  },
      { name: 'FNB Head Office',        post: '8 guards',   status: '87%', statusColor: 'text-amber-400'  },
      { name: 'Airport Road Site',      post: '6 guards',   status: '100%',statusColor: 'text-green-400'  },
      { name: 'Maerua Mall',            post: '10 guards',  status: '80%', statusColor: 'text-amber-400'  },
    ],
  },
  {
    id:       'owner',
    label:    'Executive',
    icon:     TrendingUp,
    tagline:  'KPIs and financials anywhere',
    color:    'text-amber-400',
    activeBg: 'bg-amber-500',
    features: [
      { icon: BarChart3,    text: 'KPI tiles: Attendance %, Active Guards, Incidents, Sites'   },
      { icon: DollarSign,   text: 'Payroll cost YTD + 6-month trend chart'                     },
      { icon: TrendingUp,   text: 'Calendar heatmap — daily attendance across the month'       },
      { icon: Users,        text: 'Guard reliability rankings — worst performers flagged'       },
      { icon: MapPin,       text: 'Site performance league table — sort by attendance'         },
      { icon: DollarSign,   text: 'Client invoice aging — know who owes what'                  },
    ],
    mockupTitle: 'Executive KPIs',
    mockupSite:  'June 2026 · Company Overview',
    mockupStats: [
      { label: 'Attend.', value: '93%',     color: 'bg-green-500' },
      { label: 'Payroll', value: 'N$182k',  color: 'bg-amber-500' },
      { label: 'Overdue', value: 'N$54k',   color: 'bg-red-500'   },
    ],
    mockupGuards: [
      { name: 'Attendance Rate',      post: 'vs 95% target',   status: '93%',     statusColor: 'text-amber-400' },
      { name: 'Guards on Payroll',    post: 'active',          status: '78',      statusColor: 'text-blue-400'  },
      { name: 'Open Incidents',       post: 'action required', status: '3',       statusColor: 'text-red-400'   },
      { name: 'Invoices Overdue 60d', post: 'from 2 clients',  status: 'N$31,200',statusColor: 'text-amber-400' },
    ],
  },
]

const mobileCapabilities = [
  { icon: WifiOff,     label: 'Offline Mode',    desc: 'Mark attendance even with no signal. Syncs automatically when you reconnect.' },
  { icon: Fingerprint, label: 'Biometric Login', desc: 'Fingerprint or PIN unlock. No typing passwords at 2 AM.'                     },
  { icon: RefreshCw,   label: 'Live Sync',       desc: 'Auto-refreshes every 30 seconds. Pull-to-refresh for instant updates.'       },
  { icon: Bell,        label: 'Push Alerts',     desc: 'Certifications expiring, overtime pending, incidents logged.'                 },
]

function PhoneMockup({ role }: { role: typeof roles[number] }) {
  return (
    <div className="relative mx-auto" style={{ width: 240 }}>
      {/* Phone frame */}
      <div className="relative bg-gray-900 rounded-[2.8rem] border-4 border-gray-700 shadow-2xl overflow-hidden" style={{ aspectRatio: '9/19' }}>
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-10" />
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gray-950 flex items-end justify-between px-5 pb-1.5 z-10">
          <span className="text-[9px] text-gray-400">9:41</span>
          <Wifi className="w-3 h-3 text-gray-400" />
        </div>

        {/* Screen content */}
        <div className="absolute inset-0 pt-10 bg-gray-950 overflow-hidden">
          {/* App header */}
          <div className="px-3 pt-2 pb-2 bg-gray-900 border-b border-gray-800">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest">{role.mockupSite}</p>
            <p className="text-xs font-bold text-white">{role.mockupTitle}</p>
          </div>

          {/* Stats strip */}
          <div className="flex gap-1 px-3 py-2 bg-gray-900/50 border-b border-gray-800/50">
            {role.mockupStats.map((s) => (
              <div key={s.label} className="flex-1 text-center">
                <div className={`text-xs font-extrabold text-white`}>{s.value}</div>
                <div className="text-[7px] text-gray-500">{s.label}</div>
                <div className={`h-0.5 ${s.color} rounded-full mt-0.5 mx-auto w-4/5`} />
              </div>
            ))}
          </div>

          {/* List rows */}
          <div className="divide-y divide-gray-800/60">
            {role.mockupGuards.map((g, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] text-gray-400 font-bold">{g.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-semibold text-gray-200 truncate">{g.name}</p>
                  <p className="text-[8px] text-gray-500">{g.post}</p>
                </div>
                <span className={`text-[9px] font-bold ${g.statusColor}`}>{g.status}</span>
              </div>
            ))}
          </div>

          {/* FAB */}
          <div className="absolute bottom-4 right-3">
            <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full" />

      {/* Glow */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-20 rounded-full"
        style={{ background: role.id === 'supervisor' ? '#3b82f6' : role.id === 'manager' ? '#a855f7' : '#f59e0b' }}
      />
    </div>
  )
}

export function MobileAppSection() {
  const [active, setActive] = useState(0)
  const role = roles[active]

  return (
    <section id="mobile-app" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f172a] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full mb-5">
            <Smartphone className="w-3.5 h-3.5" /> DeployGuard Mobile
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Field operations in your pocket.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Three purpose-built role portals. Supervisors mark attendance in real-time.
            Managers oversee every site. Owners see the full financial picture — all from one app.
          </p>
        </div>

        {/* Role tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {roles.map((r, i) => {
            const Icon = r.icon
            return (
              <button
                key={r.id}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active === i
                    ? `${r.activeBg} text-white shadow-lg`
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {r.label}
              </button>
            )
          })}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Feature list */}
          <div className="space-y-8">
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${role.color}`}>
                {role.label} Portal
              </p>
              <h3 className="text-2xl font-extrabold text-white mb-2">{role.tagline}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {role.id === 'supervisor' && 'Run your daily posting sheet from the field — no paper, no radio calls, no WhatsApp chains.'}
                {role.id === 'manager'    && 'All your sites on one screen. Jump in to any problem, approve overtime, and track trends by day.'}
                {role.id === 'owner'      && 'The numbers that matter: payroll cost, attendance health, revenue at risk — visible in seconds.'}
              </p>
            </div>

            <ul className="space-y-3">
              {role.features.map((f, i) => {
                const Icon = f.icon
                return (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className={`w-3.5 h-3.5 ${role.color}`} />
                    </div>
                    <span className="text-slate-300 text-sm">{f.text}</span>
                  </li>
                )
              })}
            </ul>

            {/* Download CTA */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-3">Get the app</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/download"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download APK
                </Link>
                <Link
                  href="/start"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors"
                >
                  Try the demo first
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-xs text-slate-500 mt-2">Android 8.0+ · Free download · No account required</p>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup role={role} />
          </div>
        </div>

        {/* Mobile capabilities strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-12 border-t border-white/10">
          {mobileCapabilities.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.label} className="text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <p className="font-semibold text-white text-sm">{c.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Platform badge */}
        <div className="text-center mt-10">
          <p className="text-xs text-slate-600">
            Built with Expo · React Native · TypeScript · Available for Android · iOS coming soon
          </p>
        </div>

      </div>
    </section>
  )
}

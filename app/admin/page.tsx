'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Users, FileText, Eye, TrendingUp, Repeat2, MapPin,
  Monitor, Smartphone, ArrowRight, RefreshCw, Clock,
  CheckCircle2, Circle, XCircle, AlertCircle, Download,
} from 'lucide-react'

interface Stats {
  totalVisitors:  number
  newThisWeek:    number
  returning:      number
  demoViewed:     number
  formSubmitted:  number
  totalLeads:     number
  newLeads:       number
  conversionRate: number
}

interface RecentLead {
  id:           string
  company_name: string
  contact_name: string | null
  email:        string
  country:      string | null
  status:       string
  guard_count:  number | null
  created_at:   string
}

interface RecentVisitor {
  id:               string
  fingerprint_id:   string
  country_code:     string | null
  city:             string | null
  device_type:      string | null
  browser:          string | null
  visit_count:      number
  demo_page_viewed: boolean
  form_submitted:   boolean
  last_seen_at:     string
  first_seen_at:    string
}

interface ApkStats {
  total:    number
  thisWeek: number
  today:    number
}

interface Analytics {
  stats:          Stats
  topCountries:   [string, number][]
  deviceBreakdown: [string, number][]
  recentLeads:    RecentLead[]
  recentVisitors: RecentVisitor[]
}

const COUNTRY_NAMES: Record<string, string> = {
  NA: 'Namibia', ZA: 'South Africa', ZM: 'Zambia', ZW: 'Zimbabwe',
  BW: 'Botswana', KE: 'Kenya', TZ: 'Tanzania', UG: 'Uganda',
  NG: 'Nigeria', GH: 'Ghana', US: 'United States', GB: 'United Kingdom',
  DE: 'Germany', AU: 'Australia', IN: 'India', CN: 'China',
}
const FLAG: Record<string, string> = {
  NA: '🇳🇦', ZA: '🇿🇦', ZM: '🇿🇲', ZW: '🇿🇼', BW: '🇧🇼', KE: '🇰🇪',
  TZ: '🇹🇿', UG: '🇺🇬', NG: '🇳🇬', GH: '🇬🇭', US: '🇺🇸', GB: '🇬🇧',
  DE: '🇩🇪', AU: '🇦🇺', IN: '🇮🇳', CN: '🇨🇳',
}

function statusMeta(s: string) {
  const m = {
    new:       { label: 'New',       color: 'bg-blue-100 text-blue-700',    icon: Circle        },
    contacted: { label: 'Contacted', color: 'bg-amber-100 text-amber-700',  icon: AlertCircle   },
    converted: { label: 'Converted', color: 'bg-green-100 text-green-700',  icon: CheckCircle2  },
    lost:      { label: 'Lost',      color: 'bg-red-100 text-red-700',      icon: XCircle       },
  } as const
  return m[s as keyof typeof m] ?? { label: s, color: 'bg-gray-100 text-gray-600', icon: Circle }
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)   return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function KpiCard({
  icon: Icon, iconBg, label, value, sub, trend,
}: {
  icon: React.ElementType
  iconBg: string
  label: string
  value: string | number
  sub?: string
  trend?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-gray-900 mb-0.5">{value}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function BarRow({ label, value, max, pct }: { label: string; value: number; max: number; pct?: number }) {
  const width = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-28 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${width}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-500 w-8 text-right">{pct !== undefined ? `${pct}%` : value}</span>
    </div>
  )
}

export default function AdminDashboard() {
  const [data,     setData]     = useState<Analytics | null>(null)
  const [apkStats, setApkStats] = useState<ApkStats | null>(null)
  const [loading,  setLoading]  = useState(true)

  async function load() {
    setLoading(true)
    const [analyticsRes, apkRes] = await Promise.all([
      fetch('/api/admin/analytics'),
      fetch('/api/admin/apk-stats'),
    ])
    if (analyticsRes.ok) setData(await analyticsRes.json())
    if (apkRes.ok) {
      const apkData = await apkRes.json()
      setApkStats(apkData.stats)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const s  = data?.stats
  const tv = s?.totalVisitors ?? 0

  const topCountryMax = data?.topCountries[0]?.[1] ?? 1
  const deviceMax     = data?.deviceBreakdown[0]?.[1] ?? 1

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">Your site&apos;s performance at a glance</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <KpiCard
          icon={Users}     iconBg="bg-blue-50 text-blue-600"
          label="Total Visitors"  value={tv}
          sub="all-time fingerprinted"
        />
        <KpiCard
          icon={TrendingUp} iconBg="bg-emerald-50 text-emerald-600"
          label="New This Week"   value={s?.newThisWeek ?? 0}
          sub={`${s?.returning ?? 0} returning`}
        />
        <KpiCard
          icon={Eye}        iconBg="bg-purple-50 text-purple-600"
          label="Demo Page Views" value={s?.demoViewed ?? 0}
          sub={tv > 0 ? `${Math.round(((s?.demoViewed ?? 0) / tv) * 100)}% of visitors` : '—'}
        />
        <KpiCard
          icon={FileText}   iconBg="bg-amber-50 text-amber-600"
          label="Demo Requests"   value={s?.totalLeads ?? 0}
          sub={`${s?.conversionRate ?? 0}% conversion · ${s?.newLeads ?? 0} new this week`}
        />
        <KpiCard
          icon={Download}   iconBg="bg-rose-50 text-rose-600"
          label="APK Downloads"   value={apkStats?.total ?? 0}
          sub={apkStats ? `${apkStats.thisWeek} this week · ${apkStats.today} today` : 'loading…'}
        />
      </div>

      {/* Middle row: Recent Leads + Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Recent Leads */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-800">Recent Leads</h2>
            <Link href="/admin/leads" className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(data?.recentLeads ?? []).length === 0 && (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No leads yet.</p>
            )}
            {(data?.recentLeads ?? []).map((lead) => {
              const sm = statusMeta(lead.status)
              const SmIcon = sm.icon
              return (
                <div key={lead.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gray-500">
                      {lead.company_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{lead.company_name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {[lead.contact_name, lead.country].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sm.color}`}>
                      <SmIcon className="w-3 h-3" /> {sm.label}
                    </span>
                    <span className="text-xs text-gray-300">{relativeTime(lead.created_at)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Insights sidebar */}
        <div className="xl:col-span-2 space-y-4">

          {/* Visitor behaviour */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
            <h2 className="font-bold text-gray-800 mb-4">Visitor Behaviour</h2>
            <div className="space-y-3">
              <BarRow
                label="Returning"
                value={s?.returning ?? 0}
                max={Math.max(tv, 1)}
                pct={tv > 0 ? Math.round(((s?.returning ?? 0) / tv) * 100) : 0}
              />
              <BarRow
                label="Demo Page"
                value={s?.demoViewed ?? 0}
                max={Math.max(tv, 1)}
                pct={tv > 0 ? Math.round(((s?.demoViewed ?? 0) / tv) * 100) : 0}
              />
              <BarRow
                label="Form Submit"
                value={s?.formSubmitted ?? 0}
                max={Math.max(tv, 1)}
                pct={tv > 0 ? Math.round(((s?.formSubmitted ?? 0) / tv) * 100) : 0}
              />
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" /> Top Countries
            </h2>
            {(data?.topCountries ?? []).length === 0
              ? <p className="text-sm text-gray-400">No data yet.</p>
              : (
                <div className="space-y-2.5">
                  {(data?.topCountries ?? []).map(([code, count]) => (
                    <BarRow
                      key={code}
                      label={`${FLAG[code] ?? '🌍'} ${COUNTRY_NAMES[code] ?? code}`}
                      value={count}
                      max={topCountryMax}
                    />
                  ))}
                </div>
              )
            }
          </div>

          {/* Device split */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-gray-400" /> Device Type
            </h2>
            {(data?.deviceBreakdown ?? []).length === 0
              ? <p className="text-sm text-gray-400">No data yet.</p>
              : (
                <div className="space-y-2.5">
                  {(data?.deviceBreakdown ?? []).map(([type, count]) => (
                    <div key={type} className="flex items-center gap-2">
                      {type === 'mobile' ? <Smartphone className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> : <Monitor className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                      <BarRow
                        label={type.charAt(0).toUpperCase() + type.slice(1)}
                        value={count}
                        max={deviceMax}
                        pct={tv > 0 ? Math.round((count / tv) * 100) : 0}
                      />
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      </div>

      {/* Recent Visitors */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" /> Recent Visitors
          </h2>
          <Link href="/admin/visitors" className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {['Visitor', 'Location', 'Device', 'Visits', 'Demo', 'Lead', 'Last Seen'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.recentVisitors ?? []).length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">No visitors yet.</td></tr>
              )}
              {(data?.recentVisitors ?? []).map((v) => (
                <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/admin/visitors/${v.id}`} className="font-mono text-xs text-gray-500 hover:text-amber-600 transition-colors">
                      {v.fingerprint_id.slice(0, 12)}…
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                    {[v.city, v.country_code ? (COUNTRY_NAMES[v.country_code] ?? v.country_code) : null].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      {v.device_type === 'mobile' ? <Smartphone className="w-3.5 h-3.5 text-blue-500" /> : <Monitor className="w-3.5 h-3.5 text-gray-400" />}
                      <span className="capitalize">{v.device_type ?? '—'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${v.visit_count > 1 ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                      {v.visit_count > 1 && <Repeat2 className="w-3 h-3" />}
                      {v.visit_count}×
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {v.demo_page_viewed
                      ? <span className="text-green-600 font-semibold text-xs">✓ Viewed</span>
                      : <span className="text-gray-300 text-xs">—</span>
                    }
                  </td>
                  <td className="px-5 py-3">
                    {v.form_submitted
                      ? <span className="text-amber-600 font-semibold text-xs">✓ Submitted</span>
                      : <span className="text-gray-300 text-xs">—</span>
                    }
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {relativeTime(v.last_seen_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

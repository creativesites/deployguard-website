'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Users, UserCheck, Repeat2, Eye, Monitor, Smartphone,
  RefreshCw, Search, Globe, ChevronRight, FileText,
} from 'lucide-react'

interface VisitorLead {
  company_name:  string
  contact_name:  string | null
  email:         string
  status:        string
}

interface Visitor {
  id:               string
  fingerprint_id:   string
  ip_address:       string | null
  country_code:     string | null
  city:             string | null
  browser:          string | null
  device_type:      string | null
  referrer:         string | null
  visit_count:      number
  page_views:       number
  demo_page_viewed: boolean
  form_submitted:   boolean
  first_seen_at:    string
  last_seen_at:     string
  utm_source:       string | null
  lead:             VisitorLead | null
}

const COUNTRY_NAMES: Record<string, string> = {
  NA: 'Namibia', ZA: 'South Africa', ZM: 'Zambia', ZW: 'Zimbabwe',
  BW: 'Botswana', KE: 'Kenya', TZ: 'Tanzania', UG: 'Uganda',
  NG: 'Nigeria', GH: 'Ghana', US: 'United States', GB: 'United Kingdom',
  DE: 'Germany', AU: 'Australia', IN: 'India', CN: 'China',
}

const LEAD_STATUS_COLOR: Record<string, string> = {
  new:       'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  converted: 'bg-green-100 text-green-700',
  lost:      'bg-red-100 text-red-600',
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function StatCard({ icon: Icon, label, value, sub, iconColor }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; iconColor: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
        </div>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState<'all' | 'demo' | 'lead' | 'anonymous'>('all')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/visitors')
    const json = await res.json()
    setVisitors(json.visitors ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let list = visitors

    if (filter === 'demo')      list = list.filter(v => v.demo_page_viewed)
    if (filter === 'lead')      list = list.filter(v => v.form_submitted)
    if (filter === 'anonymous') list = list.filter(v => !v.form_submitted)

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(v =>
        v.lead?.company_name?.toLowerCase().includes(q) ||
        v.lead?.contact_name?.toLowerCase().includes(q) ||
        v.lead?.email?.toLowerCase().includes(q) ||
        v.city?.toLowerCase().includes(q) ||
        (v.country_code && (COUNTRY_NAMES[v.country_code] ?? v.country_code).toLowerCase().includes(q))
      )
    }

    return list
  }, [visitors, filter, search])

  const total     = visitors.length
  const fpd       = visitors.filter(v => v.demo_page_viewed).length
  const returning = visitors.filter(v => v.visit_count > 1).length
  const leads     = visitors.filter(v => v.form_submitted).length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Visitors</h1>
          <p className="text-sm text-gray-400 mt-0.5">Every fingerprinted visitor to your site</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}     label="Total"      value={total}     sub="unique devices" iconColor="bg-blue-50 text-blue-600"    />
        <StatCard icon={Repeat2}   label="Returning"  value={returning} sub="visited 2+ times" iconColor="bg-purple-50 text-purple-600" />
        <StatCard icon={Eye}       label="Demo Views" value={fpd}       sub="visited /start" iconColor="bg-emerald-50 text-emerald-600" />
        <StatCard icon={UserCheck} label="Leads"      value={leads}     sub="submitted form" iconColor="bg-amber-50 text-amber-600"    />
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, name, email, city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1">
          {(['all', 'demo', 'lead', 'anonymous'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filter === f ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {f === 'lead' ? 'Leads' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  {['Visitor / Lead', 'Location', 'Device & Browser', 'Visits', 'Page Views', 'Demo', 'Status', 'Last Seen', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">
                      No visitors match the current filter.
                    </td>
                  </tr>
                )}
                {filtered.map((v) => (
                  <tr key={v.id} className="border-b border-gray-50 hover:bg-amber-50/20 transition-colors group">

                    {/* Visitor / Lead identity */}
                    <td className="px-5 py-3.5">
                      {v.lead ? (
                        <div>
                          <p className="font-semibold text-gray-800">{v.lead.company_name}</p>
                          <p className="text-xs text-gray-400">{v.lead.contact_name ?? v.lead.email}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-mono text-xs text-gray-400">{v.fingerprint_id.slice(0, 14)}…</p>
                          <p className="text-xs text-gray-300">Anonymous</p>
                        </div>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                        <Globe className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                        {[v.city, v.country_code ? (COUNTRY_NAMES[v.country_code] ?? v.country_code) : null].filter(Boolean).join(', ') || '—'}
                      </div>
                    </td>

                    {/* Device */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-gray-600 capitalize whitespace-nowrap">
                        {v.device_type === 'mobile'
                          ? <Smartphone className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          : <Monitor    className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        }
                        {v.device_type ?? '—'}
                        {v.browser && <span className="text-gray-300">· {v.browser}</span>}
                      </div>
                    </td>

                    {/* Visit count */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        v.visit_count > 1 ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {v.visit_count > 1 && <Repeat2 className="w-3 h-3" />}
                        {v.visit_count}×
                      </span>
                    </td>

                    {/* Page views */}
                    <td className="px-5 py-3.5 text-gray-500 text-center">{v.page_views}</td>

                    {/* Demo */}
                    <td className="px-5 py-3.5">
                      {v.demo_page_viewed
                        ? <span className="text-xs font-semibold text-green-600">✓ Yes</span>
                        : <span className="text-xs text-gray-300">—</span>
                      }
                    </td>

                    {/* Lead status */}
                    <td className="px-5 py-3.5">
                      {v.form_submitted && v.lead ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${LEAD_STATUS_COLOR[v.lead.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          <FileText className="w-3 h-3 mr-1" />
                          {v.lead.status}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">Anonymous</span>
                      )}
                    </td>

                    {/* Last seen */}
                    <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                      {relativeTime(v.last_seen_at)}
                    </td>

                    {/* Detail link */}
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/visitors/${v.id}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 whitespace-nowrap"
                      >
                        Profile <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer count */}
        {!loading && (
          <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/30">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {total} visitor{total !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

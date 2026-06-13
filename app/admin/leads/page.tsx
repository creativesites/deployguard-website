'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  FileText, CheckCircle2, Circle, XCircle, AlertCircle,
  RefreshCw, Search, ChevronDown, Phone, Mail, MapPin,
  Building2, Shield, MessageSquare, Save, X,
} from 'lucide-react'

interface Lead {
  id:           string
  company_name: string
  contact_name: string | null
  email:        string
  phone:        string
  country:      string | null
  guard_count:  number | null
  message:      string | null
  status:       string
  source:       string
  notes:        string | null
  created_at:   string
  last_seen_at: string
  country_code: string | null
  city:         string | null
  browser:      string | null
  device_type:  string | null
}

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'lost'] as const
type LeadStatus = typeof STATUS_OPTIONS[number]

const STATUS_META: Record<LeadStatus, { label: string; color: string; icon: React.ElementType }> = {
  new:       { label: 'New',       color: 'bg-blue-100 text-blue-700',   icon: Circle       },
  contacted: { label: 'Contacted', color: 'bg-amber-100 text-amber-700', icon: AlertCircle  },
  converted: { label: 'Converted', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  lost:      { label: 'Lost',      color: 'bg-red-100 text-red-600',     icon: XCircle      },
}

const GUARD_LABELS: Record<number, string> = {
  50:  '1 – 50',
  250: '51 – 250',
  500: '251+',
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as LeadStatus] ?? { label: status, color: 'bg-gray-100 text-gray-600', icon: Circle }
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${meta.color}`}>
      <Icon className="w-3 h-3" /> {meta.label}
    </span>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function LeadDrawer({ lead, onClose, onSave }: {
  lead: Lead
  onClose: () => void
  onSave: (id: string, status: string, notes: string) => Promise<void>
}) {
  const [status, setStatus] = useState(lead.status)
  const [notes,  setNotes]  = useState(lead.notes ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave(lead.id, status, notes)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{lead.company_name}</h2>
            <p className="text-sm text-gray-400">{lead.contact_name ?? lead.email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-6">

          {/* Contact details */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Contact</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline truncate">{lead.email}</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <a href={`tel:${lead.phone}`} className="text-gray-700">{lead.phone}</a>
              </div>
              {lead.country && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <span className="text-gray-700">{[lead.city, lead.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Business details */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Business</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <span className="text-gray-700">{lead.company_name}</span>
              </div>
              {lead.guard_count != null && (
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <span className="text-gray-700">{GUARD_LABELS[lead.guard_count] ?? lead.guard_count} guards</span>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Message</h3>
              <div className="flex gap-3">
                <MessageSquare className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 leading-relaxed">{lead.message}</p>
              </div>
            </div>
          )}

          {/* Device / tech info */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Tech Info</h3>
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-500 space-y-1.5">
              <div className="flex justify-between"><span>Device</span><span className="capitalize">{lead.device_type ?? '—'}</span></div>
              <div className="flex justify-between"><span>Browser</span><span>{lead.browser ?? '—'}</span></div>
              <div className="flex justify-between"><span>Source</span><span>{lead.source}</span></div>
              <div className="flex justify-between"><span>Submitted</span><span>{new Date(lead.created_at).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Last seen</span><span>{relativeTime(lead.last_seen_at)}</span></div>
            </div>
          </div>

          {/* Status update */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => {
                const m = STATUS_META[s]
                const Icon = m.icon
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      status === s
                        ? `${m.color} border-current`
                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this lead…"
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition resize-none"
            />
          </div>
        </div>

        {/* Save footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LeadsPage() {
  const [leads,    setLeads]    = useState<Lead[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState<string>('all')
  const [selected, setSelected] = useState<Lead | null>(null)

  async function load() {
    setLoading(true)
    const res  = await fetch('/api/admin/leads')
    const json = await res.json()
    setLeads(json.leads ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave(id: string, status: string, notes: string) {
    await fetch('/api/admin/leads', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, notes }),
    })
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status, notes } : l))
    setSelected(prev => prev?.id === id ? { ...prev, status, notes } : prev)
  }

  const filtered = useMemo(() => {
    let list = leads
    if (filter !== 'all') list = list.filter(l => l.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(l =>
        l.company_name.toLowerCase().includes(q) ||
        l.contact_name?.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.country?.toLowerCase().includes(q) ||
        l.phone.includes(q)
      )
    }
    return list
  }, [leads, filter, search])

  const byStatus = useMemo(() => {
    const c: Record<string, number> = {}
    leads.forEach(l => { c[l.status] = (c[l.status] ?? 0) + 1 })
    return c
  }, [leads])

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const newThisWeek = leads.filter(l => new Date(l.created_at).getTime() > weekAgo).length

  return (
    <div className="space-y-6">

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Demo Requests</h1>
          <p className="text-sm text-gray-400 mt-0.5">Companies who have requested the live demo</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total"     value={leads.length}         sub="all time"       color="text-gray-900"      />
        <StatCard label="New"       value={byStatus.new ?? 0}    sub="not contacted"  color="text-blue-600"      />
        <StatCard label="Contacted" value={byStatus.contacted ?? 0}                   color="text-amber-600"     />
        <StatCard label="Converted" value={byStatus.converted ?? 0} sub="paying customer" color="text-green-600" />
        <StatCard label="This Week" value={newThisWeek}           sub="new requests"   color="text-purple-600"    />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, contact, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition"
          />
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition font-medium text-gray-700"
          >
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>
                {STATUS_META[s].label} ({byStatus[s] ?? 0})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  {['Company', 'Contact', 'Location', 'Guards', 'Status', 'Submitted', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">
                      No leads match your filter.
                    </td>
                  </tr>
                )}
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-gray-50 hover:bg-amber-50/20 cursor-pointer transition-colors group"
                    onClick={() => setSelected(lead)}
                  >
                    {/* Company */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-gray-500">
                            {lead.company_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-800">{lead.company_name}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-3.5">
                      <p className="text-gray-700">{lead.contact_name ?? '—'}</p>
                      <p className="text-xs text-gray-400">{lead.email}</p>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                        {[lead.city, lead.country].filter(Boolean).join(', ') || '—'}
                      </div>
                    </td>

                    {/* Guards */}
                    <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                      {lead.guard_count != null
                        ? `${GUARD_LABELS[lead.guard_count] ?? lead.guard_count} guards`
                        : '—'
                      }
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <StatusBadge status={lead.status} />
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {relativeTime(lead.created_at)}
                    </td>

                    {/* Arrow */}
                    <td className="px-5 py-3.5">
                      <FileText className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/30">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {leads.length} lead{leads.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

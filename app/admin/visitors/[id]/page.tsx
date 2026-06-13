'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Globe, Monitor, Smartphone, Repeat2, Eye,
  FileText, Clock, Calendar, Link2, CheckCircle2, Circle,
  AlertCircle, XCircle, Phone, Mail, MapPin, Building2, Shield,
} from 'lucide-react'

interface Visitor {
  id:               string
  fingerprint_id:   string
  ip_address:       string | null
  country_code:     string | null
  city:             string | null
  browser:          string | null
  device_type:      string | null
  referrer:         string | null
  utm_source:       string | null
  utm_medium:       string | null
  utm_campaign:     string | null
  visit_count:      number
  page_views:       number
  demo_page_viewed: boolean
  form_submitted:   boolean
  first_seen_at:    string
  last_seen_at:     string
}

interface VisitorEvent {
  id:             string
  fingerprint_id: string
  event_type:     string
  page:           string | null
  element:        string | null
  metadata:       Record<string, unknown>
  created_at:     string
}

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
  created_at:   string
}

const COUNTRY_NAMES: Record<string, string> = {
  NA: 'Namibia', ZA: 'South Africa', ZM: 'Zambia', ZW: 'Zimbabwe',
  BW: 'Botswana', KE: 'Kenya', TZ: 'Tanzania', UG: 'Uganda',
  NG: 'Nigeria', GH: 'Ghana', US: 'United States', GB: 'United Kingdom',
  DE: 'Germany', AU: 'Australia', IN: 'India', CN: 'China',
}

const GUARD_LABELS: Record<number, string> = { 50: '1–50', 250: '51–250', 500: '251+' }

const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  new:       { label: 'New',       color: 'bg-blue-100 text-blue-700',   icon: Circle       },
  contacted: { label: 'Contacted', color: 'bg-amber-100 text-amber-700', icon: AlertCircle  },
  converted: { label: 'Converted', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  lost:      { label: 'Lost',      color: 'bg-red-100 text-red-600',     icon: XCircle      },
}

const EVENT_META: Record<string, { label: string; color: string; dot: string }> = {
  page_view:    { label: 'Page view',    color: 'text-gray-500',   dot: 'bg-gray-400'   },
  demo_page:    { label: 'Demo page',    color: 'text-purple-600', dot: 'bg-purple-500' },
  cta_click:    { label: 'CTA click',    color: 'text-blue-600',   dot: 'bg-blue-500'   },
  form_submit:  { label: 'Form submit',  color: 'text-green-600',  dot: 'bg-green-500'  },
  feature_click:{ label: 'Feature click',color: 'text-amber-600',  dot: 'bg-amber-500'  },
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'yesterday'
  if (days < 7)  return `${days} days ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="w-4 h-4 text-gray-300 flex-shrink-0" />
      <span className="text-gray-400 w-20 flex-shrink-0">{label}</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>
  )
}

export default function VisitorDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [visitor, setVisitor] = useState<Visitor | null>(null)
  const [events,  setEvents]  = useState<VisitorEvent[]>([])
  const [lead,    setLead]    = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/visitors/${id}`)
      if (!res.ok) { setError(true); setLoading(false); return }
      const data = await res.json()
      setVisitor(data.visitor)
      setEvents(data.events)
      setLead(data.lead)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !visitor) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 mb-4">Visitor not found.</p>
        <Link href="/admin/visitors" className="text-amber-600 hover:underline text-sm">
          ← Back to Visitors
        </Link>
      </div>
    )
  }

  const sm    = lead ? (STATUS_META[lead.status] ?? STATUS_META.new) : null
  const SmIcon = sm?.icon ?? Circle

  // Group events by day
  const grouped: Record<string, VisitorEvent[]> = {}
  for (const e of events) {
    const day = new Date(e.created_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    if (!grouped[day]) grouped[day] = []
    grouped[day].push(e)
  }

  // Page interest (which pages visited most)
  const pageCounts: Record<string, number> = {}
  for (const e of events) {
    if (e.event_type === 'page_view' && e.page) {
      pageCounts[e.page] = (pageCounts[e.page] ?? 0) + 1
    }
  }
  const pageRanking = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxPageCount = pageRanking[0]?.[1] ?? 1

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Back */}
      <Link href="/admin/visitors" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Visitors
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
            {visitor.device_type === 'mobile'
              ? <Smartphone className="w-7 h-7 text-gray-500" />
              : <Monitor    className="w-7 h-7 text-gray-500" />
            }
          </div>
          <div className="flex-1">
            {lead ? (
              <>
                <h1 className="text-xl font-extrabold text-gray-900">{lead.company_name}</h1>
                <p className="text-sm text-gray-500">{lead.contact_name ?? lead.email}</p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-extrabold text-gray-900">Anonymous Visitor</h1>
                <p className="font-mono text-xs text-gray-400">{visitor.fingerprint_id}</p>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {visitor.visit_count > 1 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                <Repeat2 className="w-3 h-3" /> {visitor.visit_count} visits
              </span>
            )}
            {visitor.demo_page_viewed && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                <Eye className="w-3 h-3" /> Demo viewed
              </span>
            )}
            {visitor.form_submitted && sm && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${sm.color}`}>
                <SmIcon className="w-3 h-3" /> {sm.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left column: details */}
        <div className="space-y-5">

          {/* Visitor info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Visitor Info</h2>
            <div className="space-y-3">
              <InfoRow icon={Globe}    label="Location" value={[visitor.city, visitor.country_code ? (COUNTRY_NAMES[visitor.country_code] ?? visitor.country_code) : null].filter(Boolean).join(', ') || null} />
              <InfoRow icon={Monitor}  label="Device"   value={visitor.device_type} />
              <InfoRow icon={Globe}    label="Browser"  value={visitor.browser} />
              <InfoRow icon={Globe}    label="IP"       value={visitor.ip_address} />
              {visitor.referrer && (
                <div className="flex items-start gap-3 text-sm">
                  <Link2 className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 w-20 flex-shrink-0">Referrer</span>
                  <span className="text-gray-700 font-medium text-xs break-all">{visitor.referrer}</span>
                </div>
              )}
              {visitor.utm_source && (
                <InfoRow icon={Link2} label="UTM" value={[visitor.utm_source, visitor.utm_medium].filter(Boolean).join(' / ')} />
              )}
            </div>
          </div>

          {/* Timeline summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <span className="text-gray-400 w-20 flex-shrink-0">First seen</span>
                <span className="text-gray-700 font-medium">{relativeTime(visitor.first_seen_at)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <span className="text-gray-400 w-20 flex-shrink-0">Last seen</span>
                <span className="text-gray-700 font-medium">{relativeTime(visitor.last_seen_at)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Repeat2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <span className="text-gray-400 w-20 flex-shrink-0">Visits</span>
                <span className="text-gray-700 font-medium">{visitor.visit_count}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FileText className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <span className="text-gray-400 w-20 flex-shrink-0">Page views</span>
                <span className="text-gray-700 font-medium">{visitor.page_views}</span>
              </div>
            </div>
          </div>

          {/* Lead info */}
          {lead && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Lead Details
              </h2>
              <div className="space-y-3">
                <InfoRow icon={Building2} label="Company"  value={lead.company_name} />
                <InfoRow icon={Globe}     label="Contact"  value={lead.contact_name} />
                <InfoRow icon={Mail}      label="Email"    value={lead.email} />
                <InfoRow icon={Phone}     label="Phone"    value={lead.phone} />
                <InfoRow icon={MapPin}    label="Country"  value={lead.country} />
                {lead.guard_count != null && (
                  <InfoRow icon={Shield}  label="Guards"   value={`${GUARD_LABELS[lead.guard_count] ?? lead.guard_count} guards`} />
                )}
              </div>
              {lead.message && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs text-gray-400 mb-2">Message</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{lead.message}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column: interest + events */}
        <div className="lg:col-span-2 space-y-5">

          {/* Page interest */}
          {pageRanking.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Page Interest</h2>
              <div className="space-y-3">
                {pageRanking.map(([page, count]) => (
                  <div key={page} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-mono w-32 flex-shrink-0 truncate">{page}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${Math.round((count / maxPageCount) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{count}×</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Event Timeline ({events.length} events)
            </h2>

            {events.length === 0 ? (
              <p className="text-sm text-gray-400">No events recorded yet.</p>
            ) : (
              <div className="space-y-5">
                {Object.entries(grouped).map(([day, dayEvents]) => (
                  <div key={day}>
                    <p className="text-xs font-semibold text-gray-400 mb-2">{day}</p>
                    <div className="space-y-1 pl-3 border-l-2 border-gray-100">
                      {dayEvents.map((e) => {
                        const meta = EVENT_META[e.event_type] ?? EVENT_META.page_view
                        return (
                          <div key={e.id} className="flex items-start gap-3 py-1 group">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 -ml-[5px] ${meta.dot}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
                                {e.page && (
                                  <span className="font-mono text-xs text-gray-400 truncate">{e.page}</span>
                                )}
                                {e.element && (
                                  <span className="text-xs text-gray-300">· {e.element}</span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-gray-300 flex-shrink-0 whitespace-nowrap">
                              {new Date(e.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}

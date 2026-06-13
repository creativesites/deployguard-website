'use client'

import { useEffect, useState } from 'react'
import { Download, RefreshCw, MapPin, TrendingUp, Calendar } from 'lucide-react'

interface ApkDownload {
  id:            string
  fingerprint_id: string | null
  ip_address:    string | null
  country_code:  string | null
  city:          string | null
  app_version:   string | null
  created_at:    string
}

interface ApkData {
  stats: {
    total:    number
    thisWeek: number
    today:    number
  }
  topCountries:  [string, number][]
  trend:         [string, number][]
  recent:        ApkDownload[]
  apkAvailable:  boolean
  apkVersion:    string | null
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

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-4`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-extrabold text-gray-900 mb-0.5">{value}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function DownloadsPage() {
  const [data,    setData]    = useState<ApkData | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/apk-stats')
    if (res.ok) setData(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const maxCountry = data?.topCountries[0]?.[1] ?? 1
  const maxTrend   = Math.max(...(data?.trend.map(([, n]) => n) ?? [1]), 1)

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">APK Downloads</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {data?.apkAvailable
              ? `v${data.apkVersion ?? '?'} — live and tracking`
              : 'APK not yet published — configure APK_DOWNLOAD_URL in environment'
            }
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {!data?.apkAvailable && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <p className="text-sm font-semibold text-amber-800 mb-1">APK not published yet</p>
          <p className="text-sm text-amber-700">
            Set <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">APK_DOWNLOAD_URL</code> in your
            environment variables to make the download live. Once set, this page will track every download automatically.
          </p>
          <p className="text-xs text-amber-600 mt-2">
            Optionally also set <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">APK_VERSION</code>{' '}
            and <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">APK_FILE_SIZE_MB</code>.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={Download}   label="Total Downloads"  value={data?.stats.total    ?? 0} color="bg-rose-50 text-rose-600"     />
            <StatCard icon={TrendingUp} label="This Week"        value={data?.stats.thisWeek ?? 0} color="bg-blue-50 text-blue-600"     sub="last 7 days" />
            <StatCard icon={Calendar}   label="Today"            value={data?.stats.today    ?? 0} color="bg-emerald-50 text-emerald-600" sub="last 24 hours" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* 14-day trend */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
              <h2 className="font-bold text-gray-800 mb-5">14-Day Download Trend</h2>
              {(data?.trend ?? []).length === 0 ? (
                <p className="text-sm text-gray-400">No downloads recorded yet.</p>
              ) : (
                <div className="flex items-end gap-1.5 h-28">
                  {(data?.trend ?? []).map(([day, count]) => (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t bg-rose-400 hover:bg-rose-500 transition-colors"
                        style={{ height: `${Math.max(4, Math.round((count / maxTrend) * 96))}px` }}
                        title={`${day}: ${count} downloads`}
                      />
                      <span className="text-[8px] text-gray-400 rotate-45 origin-top-left whitespace-nowrap">
                        {day.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top countries */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
              <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Downloads by Country
              </h2>
              {(data?.topCountries ?? []).length === 0 ? (
                <p className="text-sm text-gray-400">No data yet.</p>
              ) : (
                <div className="space-y-3">
                  {(data?.topCountries ?? []).map(([code, count]) => (
                    <div key={code} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-32 flex-shrink-0 truncate">
                        {FLAG[code] ?? '🌍'} {COUNTRY_NAMES[code] ?? code}
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-400 rounded-full"
                          style={{ width: `${Math.round((count / maxCountry) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent downloads table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-800">Recent Downloads</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    {['Fingerprint', 'Location', 'IP Address', 'Version', 'When'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data?.recent ?? []).length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-gray-400">
                        No downloads yet.
                      </td>
                    </tr>
                  )}
                  {(data?.recent ?? []).map((dl) => (
                    <tr key={dl.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs text-gray-400">
                          {dl.fingerprint_id ? `${dl.fingerprint_id.slice(0, 12)}…` : '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {[dl.city, dl.country_code ? (COUNTRY_NAMES[dl.country_code] ?? dl.country_code) : null].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs text-gray-400">{dl.ip_address ?? '—'}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {dl.app_version ? `v${dl.app_version}` : '—'}
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {relativeTime(dl.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

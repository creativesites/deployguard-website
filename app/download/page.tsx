'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react'
import {
  Download, Smartphone, CheckCircle2, ArrowRight, ExternalLink,
  Shield, Wifi, Fingerprint, RefreshCw, ChevronRight, ArrowLeft,
  ClipboardList, Building2, TrendingUp, Clock,
} from 'lucide-react'

interface ApkInfo {
  available:   boolean
  url:         string
  version:     string
  fileSizeMb:  string | null
  minAndroid:  string
}

const DEMO_URL      = 'http://47.84.205.81:8069/odoo/'
const DEMO_PASSWORD = 'Demo2026!'

const roles = [
  { icon: ClipboardList, label: 'Supervisor',  desc: 'Mark guard attendance, submit posting sheets'   },
  { icon: Building2,     label: 'Manager',     desc: 'Multi-site dashboard, approve overtime'         },
  { icon: TrendingUp,    label: 'Executive',   desc: 'KPIs, payroll trends, financial overview'       },
]

const setupSteps = [
  { n: '1', title: 'Download the APK',        body: 'Tap the button above. Your browser may warn you — allow the download. The file is safe.' },
  { n: '2', title: 'Allow Unknown Sources',   body: 'On Android: Settings → Security → Install Unknown Apps → enable for your browser or file manager.' },
  { n: '3', title: 'Install DeployGuard',     body: 'Open the downloaded file and tap Install. The app is ~74 MB and takes under a minute.' },
  { n: '4', title: 'Connect to Demo Server',  body: 'Launch the app. When prompted for a server URL, enter the demo server address shown below.' },
  { n: '5', title: 'Log in with demo credentials', body: 'Use the role credentials below. Each role shows a different view of the same live data.' },
]

const demoCredentials = [
  { role: 'Guard Supervisor', username: 'supervisor@demo.deployguard.io', password: DEMO_PASSWORD, icon: ClipboardList, color: 'border-blue-200 bg-blue-50' },
  { role: 'Site Manager',     username: 'manager@demo.deployguard.io',    password: DEMO_PASSWORD, icon: Building2,    color: 'border-purple-200 bg-purple-50' },
  { role: 'Company Owner',    username: 'owner@demo.deployguard.io',      password: DEMO_PASSWORD, icon: TrendingUp,   color: 'border-amber-200 bg-amber-50' },
]

export default function DownloadPage() {
  const [apkInfo,    setApkInfo]    = useState<ApkInfo | null>(null)
  const [available,  setAvailable]  = useState<boolean | null>(null)
  const [downloaded, setDownloaded] = useState(false)
  const [loading,    setLoading]    = useState(false)

  const { data: fpData } = useVisitorData({ extendedResult: true }, { immediate: true })

  useEffect(() => {
    fetch('/api/download-apk')
      .then(r => r.json())
      .then((d: ApkInfo) => {
        setApkInfo(d)
        setAvailable(d.available)
      })
      .catch(() => setAvailable(false))
  }, [])

  async function handleDownload() {
    if (!apkInfo?.url) return
    setLoading(true)

    try {
      const res = await fetch('/api/download-apk', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fingerprintId: fpData?.visitorId                  ?? null,
          countryCode:   fpData?.ipLocation?.country?.code  ?? null,
          city:          fpData?.ipLocation?.city?.name     ?? null,
        }),
      })
      const data = await res.json()
      if (data.ok && data.url) {
        setDownloaded(true)
        window.location.href = data.url
      }
    } catch {
      // Fall back to direct link
      window.location.href = apkInfo.url
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">

      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/deployguard-small.png" className="h-12" alt="DeployGuard" />
          <span className="font-bold text-gray-900">DeployGuard OS</span>
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to site
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-12">

        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900 mb-2">
            <Smartphone className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">DeployGuard Mobile</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            The companion app for field supervisors, site managers, and company executives.
            Free to download — connect directly to the live demo server.
          </p>

          {/* Role pills */}
          <div className="flex justify-center gap-2 flex-wrap pt-2">
            {roles.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-600 shadow-sm">
                <Icon className="w-3.5 h-3.5 text-gray-400" /> {label}
              </span>
            ))}
          </div>
        </div>

        {/* Download card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-5">
          {available === null && (
            <div className="flex justify-center">
              <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full" />
            </div>
          )}

          {available === true && apkInfo && (
            <>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Android APK</p>
                <p className="text-3xl font-extrabold text-gray-900">v{apkInfo.version}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {apkInfo.fileSizeMb ? `~${apkInfo.fileSizeMb} MB · ` : ''}Android {apkInfo.minAndroid}+ required
                </p>
              </div>

              {downloaded ? (
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  Download started! Check your downloads folder.
                </div>
              ) : (
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg transition-colors disabled:opacity-60 shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  {loading ? 'Preparing download…' : 'Download APK'}
                </button>
              )}

              <p className="text-xs text-gray-400">
                Free · No sign-up required · Safe for test installation
              </p>
            </>
          )}

          {available === false && (
            <>
              <div className="w-14 h-14 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto">
                <Clock className="w-7 h-7 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">APK Coming Soon</h2>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  The Android build is in its final stages. Check back soon — or try the browser-based
                  demo right now to see exactly what the mobile app connects to.
                </p>
              </div>
              <Link
                href="/start"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors"
              >
                Try the Browser Demo
                <ChevronRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* What you'll see */}
        <div className="space-y-5">
          <h2 className="text-xl font-extrabold text-gray-900">Three role portals in one app</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: ClipboardList, title: 'Supervisor Portal', color: 'bg-blue-50 text-blue-600',
                features: ['Daily posting sheet', 'Swipe to mark attendance', 'Quick guard assignment', 'Submit batch from field', 'Full history'],
              },
              {
                icon: Building2, title: 'Manager Portal', color: 'bg-purple-50 text-purple-600',
                features: ['Multi-site dashboard', 'Attendance by day', 'Site drill-down', 'Overtime approval', 'Performance alerts'],
              },
              {
                icon: TrendingUp, title: 'Executive Portal', color: 'bg-amber-50 text-amber-600',
                features: ['KPI tiles', 'Payroll trend chart', 'Calendar heatmap', 'Guard reliability', 'Invoice aging'],
              },
            ].map(({ icon: Icon, title, color, features }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                </div>
                <h3 className="font-bold text-gray-800">{title}</h3>
                <ul className="space-y-1.5">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* App capabilities */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Wifi,         label: 'Offline Mode',      desc: 'Works without signal'       },
            { icon: Fingerprint,  label: 'Biometric Login',   desc: 'Fingerprint or PIN unlock'   },
            { icon: RefreshCw,    label: 'Live Sync',         desc: 'Auto-refresh every 30s'      },
            { icon: Shield,       label: 'Secure Sessions',   desc: 'Encrypted token storage'     },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center space-y-2">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center mx-auto">
                <Icon className="w-4.5 h-4.5 text-gray-600" style={{ width: 18, height: 18 }} />
              </div>
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          ))}
        </div>

        {/* Installation guide */}
        <div className="space-y-5">
          <h2 className="text-xl font-extrabold text-gray-900">How to install</h2>
          <div className="space-y-3">
            {setupSteps.map((s) => (
              <div key={s.n} className="flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
                <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                  {s.n}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-0.5">{s.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo credentials */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Demo server & credentials</h2>
            <p className="text-sm text-gray-500 mt-1">
              The mobile app connects to the same live demo environment as the browser version.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Demo Server URL</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-sm font-mono bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700">
                  47.84.205.81:8069
                </code>
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-semibold whitespace-nowrap"
                >
                  Open browser demo <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {demoCredentials.map(({ role, username, password, icon: Icon, color }) => (
              <div key={role} className={`rounded-2xl border p-5 ${color} space-y-2`}>
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-800 text-sm">{role}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Username / Email</p>
                    <code className="text-xs bg-white/70 rounded px-2 py-1 text-gray-700 block truncate">{username}</code>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Password</p>
                    <code className="text-xs bg-white/70 rounded px-2 py-1 text-gray-700 block font-mono">{password}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">
            Demo data resets periodically. No real data is stored.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gray-900 rounded-2xl p-8 text-center space-y-4">
          <h2 className="text-xl font-extrabold text-white">Ready to deploy for real?</h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            The full platform includes payroll, billing, fleet, AI rostering, and more.
            Talk to us about licensing.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/start"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors"
            >
              Request a License <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

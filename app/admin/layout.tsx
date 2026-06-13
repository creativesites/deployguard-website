'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { onAuthChange, logOut, isDogforceAdmin } from '@/lib/auth'
import type { User } from '@supabase/supabase-js'
import {
  LayoutDashboard, Users, FileText, Building2,
  ShieldPlus, LogOut, Shield, ChevronRight, Download,
} from 'lucide-react'
import clsx from 'clsx'

const navGroups = [
  {
    label: 'Analytics',
    items: [
      { label: 'Dashboard',     href: '/admin',             icon: LayoutDashboard },
      { label: 'Visitors',      href: '/admin/visitors',    icon: Users           },
      { label: 'Leads',         href: '/admin/leads',       icon: FileText        },
      { label: 'App Downloads', href: '/admin/downloads',   icon: Download        },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Tenants',       href: '/admin/tenants',      icon: Building2  },
      { label: 'Issue License', href: '/admin/licenses/new', icon: ShieldPlus },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [user,        setUser]        = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [accessDenied, setAccessDenied] = useState<{ email: string | null } | null>(null)

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setAuthChecked(true)
      if (!u) {
        router.push('/admin/login')
        return
      }
      if (!isDogforceAdmin(u.id, u.email)) {
        // Don't silently redirect — surface the problem so it's diagnosable.
        console.error(
          '[AdminLayout] Access denied.\n',
          '  Logged-in UID:  ', u.id, '\n',
          '  Logged-in email:', u.email, '\n',
          '  Env UID:  ', process.env.NEXT_PUBLIC_DOGFORCE_ADMIN_UID  || '(not set)', '\n',
          '  Env email:', process.env.NEXT_PUBLIC_DOGFORCE_ADMIN_EMAIL || '(not set)',
        )
        setAccessDenied({ email: u.email ?? null })
        return
      }
      setUser(u)
    })
    return unsub
  }, [router])

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-destructive" />
          </div>
          <h1 className="text-xl font-extrabold text-foreground">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            You are logged in as <strong className="text-foreground">{accessDenied.email ?? 'unknown'}</strong>,
            but this account is not authorised as a DeployGuard admin.
          </p>
          <div className="bg-muted rounded-xl px-4 py-3 text-left text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground mb-2">To fix this, set one of these in <code>.env.local</code> and restart the dev server:</p>
            <p><code>NEXT_PUBLIC_DOGFORCE_ADMIN_EMAIL={accessDenied.email ?? 'your@email.com'}</code></p>
            <p className="text-muted-foreground/60">or</p>
            <p><code>NEXT_PUBLIC_DOGFORCE_ADMIN_UID=&lt;your Supabase UID&gt;</code></p>
            <p className="mt-2 text-muted-foreground/60">The UID is printed in the browser console (F12 → Console).</p>
          </div>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={async () => { await logOut(); router.push('/admin/login') }}
              className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Sign out &amp; try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-[#f8f9fb] overflow-hidden">

      {/* Sidebar */}
      <aside className="w-56 bg-[#0f172a] text-white flex flex-col flex-shrink-0">

        {/* Logo */}
        <div className="px-4 py-5 border-b border-white/8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <span className="font-bold text-sm block leading-tight">DeployGuard OS</span>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Admin Console</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(href)
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 truncate">{label}</span>
                    {isActive(href) && <ChevronRight className="w-3 h-3 text-white/40" />}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User + signout */}
        <div className="px-3 py-4 border-t border-white/8">
          <div className="px-3 py-1.5 mb-1">
            <p className="text-xs text-white/30 truncate">{user?.email}</p>
          </div>
          <button
            onClick={async () => { await logOut(); router.push('/') }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

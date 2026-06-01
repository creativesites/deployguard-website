'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { onAuthChange, logOut, isDogforceAdmin } from '@/lib/auth'
import type { User } from '@supabase/supabase-js'
import { LayoutDashboard, ShieldPlus, LogOut, Shield } from 'lucide-react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navItems = [
  { label: 'All Tenants',     href: '/admin',              icon: LayoutDashboard },
  { label: 'Issue License',   href: '/admin/licenses/new', icon: ShieldPlus },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setAuthChecked(true)
      if (!u || !isDogforceAdmin(u.id)) {
        router.push('/')
        return
      }
      setUser(u)
    })
    return unsub
  }, [router])

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-60 bg-foreground text-white flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm block">DeployGuard OS</span>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Admin</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={async () => { await logOut(); router.push('/') }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  )
}

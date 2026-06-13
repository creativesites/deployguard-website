'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Menu, X, Download } from 'lucide-react'

const NAV_LINKS = [
  ['Features',    '/#features'],
  ['Mobile App',  '/#mobile-app'],
  ['AI Engine',   '/ai'],
  ['Pricing',     '/pricing'],
] as const

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img
            src="/images/deployguard-small.png"
            className="h-16 transition-transform hover:scale-105 duration-500"
            alt="DeployGuard"
          />
          <span className="font-bold text-foreground text-lg tracking-tight">
            DeployGuard <span className="text-primary">OS</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/download" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Download className="w-3.5 h-3.5" /> Get App
          </Link>
          <Link href="/start" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Request Trial
          </Link>
          <Link href="/start">
            <Button size="sm" variant="primary">Book a Demo</Button>
          </Link>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/start">
            <Button size="sm" variant="primary">Demo</Button>
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-border px-4 py-4 space-y-1 shadow-lg">
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-3 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-2 space-y-1">
            <Link
              href="/download"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
            >
              <Download className="w-4 h-4" /> Get the App
            </Link>
            <Link
              href="/start"
              onClick={() => setOpen(false)}
              className="block px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
            >
              Request Trial
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

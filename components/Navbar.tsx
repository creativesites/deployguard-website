import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Shield } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-foreground text-lg tracking-tight">
            DeployGuard <span className="text-primary">OS</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {[
            ['Features',    '/#features'],
            ['How It Works','/#how-it-works'],
            ['Pricing',     '/pricing'],
          ].map(([label, href]) => (
            <Link key={label} href={href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link href="/start" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Request Trial
          </Link>
          <Link href="/start">
            <Button size="sm" variant="primary">Book a Demo</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

import Link from 'next/link'

const links = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'AI Engine', href: '/ai' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Changelog', href: '#' },
    { label: 'Roadmap', href: '#' },
  ],
  Company: [
    { label: 'About us', href: '#' },
    { label: 'Contact us', href: 'mailto:creativesites263@gmail.com' },
    { label: 'Book a Demo', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'SLA', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <img 
                src="/images/deployguard-small-transparent-bg.png" 
                className=" h-16 transition-transform hover:scale-105 duration-500" 
                alt="DeployGuard" 
            />
              <span className="font-bold text-base">DeployGuard OS</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              The intelligent workforce operating system for private security companies.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">{section}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} DeployGuard OS. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built for Africa. Designed for the world.
          </p>
        </div>
      </div>
    </footer>
  )
}

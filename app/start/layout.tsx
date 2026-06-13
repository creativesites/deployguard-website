import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Demo & Free Trial — DeployGuard OS',
  description:
    'Request a 30-minute walkthrough using your own sites, guard count, and payroll rules. 7-day full trial issued after the demo — no credit card required.',
  alternates: { canonical: 'https://deployguard.io/start' },
  openGraph: {
    title: 'Book a Demo — DeployGuard OS',
    description: "See DeployGuard OS with your own data. We'll walk through your sites, your guard count, and your payroll rules.",
    url: 'https://deployguard.io/start',
    images: [{ url: '/screenshots/executive-dashboard.png', width: 1280, height: 720 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a DeployGuard OS Demo',
    description: '7-day free trial. Full access. No credit card.',
    images: ['/screenshots/executive-dashboard.png'],
  },
}

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

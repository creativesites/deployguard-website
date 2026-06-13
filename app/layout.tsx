import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FingerprintProvider } from '@/components/FingerprintProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const BASE_URL = 'https://deployguard.io'

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'DeployGuard OS — Workforce Management for Private Security Companies',
    template: '%s | DeployGuard OS',
  },
  description:
    'DeployGuard OS automates rosters, payroll, GPS attendance, client billing, and AI-powered shift planning. Built for security companies in Namibia, Zambia, and across Africa.',
  keywords: [
    'security company software',
    'guard management system',
    'security payroll software Africa',
    'Namibia security software',
    'Odoo security modules',
    'workforce management security',
    'guard roster software',
    'AI shift planning security',
    'GPS attendance security guards',
    'private security ERP',
    'security billing software',
    'labour compliance Namibia',
    'SSC PAYE payroll Namibia',
    'DeployGuard',
    'DeployGuard OS',
  ],
  authors: [{ name: 'DeployGuard OS', url: BASE_URL }],
  creator: 'DeployGuard OS',
  publisher: 'DeployGuard OS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/deployguard.ico', sizes: 'any' },
      { url: '/deployguard.ico', type: 'image/x-icon' },
    ],
    shortcut: '/deployguard.ico',
    apple: '/deployguard.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: BASE_URL,
    siteName: 'DeployGuard OS',
    title: 'DeployGuard OS — Workforce Management for Private Security',
    description:
      'Replace your roster spreadsheet, payroll Excel, and manual invoices with one intelligent platform. Built for African security companies.',
    images: [
      {
        url: '/screenshots/executive-dashboard.png',
        width: 1280,
        height: 720,
        alt: 'DeployGuard OS — Executive Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeployGuard OS — The Workforce OS for Private Security',
    description:
      'Rosters, payroll, GPS check-in, billing, and AI-powered operations — built for security companies across Africa.',
    images: ['/screenshots/executive-dashboard.png'],
    creator: '@deployguard',
    site: '@deployguard',
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: 'technology',
  applicationName: 'DeployGuard OS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Structured Data — Organisation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'DeployGuard OS',
              url: BASE_URL,
              logo: `${BASE_URL}/images/deployguard-small.png`,
              description:
                'DeployGuard OS is the intelligent workforce management platform for private security companies in Africa.',
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'hello@deployguard.io',
                contactType: 'sales',
                areaServed: ['NA', 'ZM', 'ZA', 'BW', 'ZW'],
                availableLanguage: 'English',
              },
              sameAs: [
                'https://linkedin.com/company/deployguard',
              ],
            }),
          }}
        />
        {/* Structured Data — SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'DeployGuard OS',
              operatingSystem: 'Web',
              applicationCategory: 'BusinessApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: '7-day free trial. Contact for pricing.',
              },
              description:
                'Security workforce management platform with roster automation, payroll, GPS attendance, client billing, and AI-powered operations.',
              url: BASE_URL,
            }),
          }}
        />
      </head>
      <body>
        <FingerprintProvider>{children}</FingerprintProvider>
      </body>
    </html>
  )
}

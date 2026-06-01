import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DeployGuard OS — The Workforce OS for Private Security',
  description:
    'Automate rosters, payroll, attendance, and billing. Built for security companies in Namibia, Zambia, and beyond.',
  openGraph: {
    title: 'DeployGuard OS',
    description: 'The intelligent workforce operating system for private security.',
    url: 'https://deployguard.io',
    siteName: 'DeployGuard OS',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}

'use client'

import { FpjsProvider, useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, createContext, useContext, useCallback } from 'react'

type TrackFn = (eventType: string, element?: string, metadata?: Record<string, unknown>) => void

const TrackContext = createContext<TrackFn>(() => {})

export function useTrackEvent() {
  return useContext(TrackContext)
}

function VisitorTracker({ children }: { children: React.ReactNode }) {
  const { data: fpData } = useVisitorData({ extendedResult: true }, { immediate: true })
  const pathname          = usePathname()
  const trackedFp         = useRef<string | null>(null)
  const fpId              = fpData?.visitorId ?? null

  const track = useCallback<TrackFn>((eventType, element, metadata) => {
    if (!fpId) return
    fetch('/api/track-event', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fingerprintId: fpId,
        eventType,
        page:     typeof window !== 'undefined' ? window.location.pathname : null,
        element:  element  ?? null,
        metadata: metadata ?? {},
      }),
    }).catch(() => {})
  }, [fpId])

  // Register visitor once fingerprint is resolved
  useEffect(() => {
    if (!fpId || trackedFp.current === fpId) return
    trackedFp.current = fpId

    const rawDevice  = fpData?.device ?? ''
    const deviceType = /ipad|tablet/i.test(rawDevice)   ? 'tablet'  :
                       /mobi|android|iphone/i.test(rawDevice) ? 'mobile' : 'desktop'

    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')

    fetch('/api/track-visitor', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fingerprintId: fpId,
        browser:     fpData?.browserName                    ?? null,
        deviceType,
        ipAddress:   fpData?.ip                             ?? null,
        countryCode: fpData?.ipLocation?.country?.code      ?? null,
        city:        fpData?.ipLocation?.city?.name         ?? null,
        referrer:    typeof document !== 'undefined' ? (document.referrer || null) : null,
        utmSource:   params.get('utm_source'),
        utmMedium:   params.get('utm_medium'),
        utmCampaign: params.get('utm_campaign'),
      }),
    }).catch(() => {})
  }, [fpId, fpData])

  // Track page views on every navigation
  useEffect(() => {
    if (!fpId) return
    fetch('/api/track-event', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fingerprintId: fpId,
        eventType: 'page_view',
        page:      pathname,
      }),
    }).catch(() => {})
  }, [fpId, pathname])

  return (
    <TrackContext.Provider value={track}>
      {children}
    </TrackContext.Provider>
  )
}

export function FingerprintProvider({ children }: { children: React.ReactNode }) {
  return (
    <FpjsProvider loadOptions={{ apiKey: '58kwV05oXy0tm8UXKb7W' }}>
      <VisitorTracker>{children}</VisitorTracker>
    </FpjsProvider>
  )
}

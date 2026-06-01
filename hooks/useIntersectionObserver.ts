'use client'

import { useEffect, useRef, useState } from 'react'

interface Options extends IntersectionObserverInit {
  once?: boolean
}

export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: Options = {},
) {
  const { once = true, ...observerOptions } = options
  const [hasIntersected, setHasIntersected] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!ref.current) return

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasIntersected(true)
        if (once) observerRef.current?.disconnect()
      }
    }, observerOptions)

    observerRef.current.observe(ref.current)
    return () => observerRef.current?.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, once])

  return { hasIntersected }
}

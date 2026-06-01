"use client";

import { useEffect, useState, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/**
 * Counts up to `value` once the element scrolls into view.
 * Uses requestAnimationFrame for smooth animation.
 * Respects prefers-reduced-motion — jumps to final value immediately.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1800,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const { hasIntersected } = useIntersectionObserver(ref, { threshold: 0.3 });
  const rafRef = useRef<number>(0);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (!hasIntersected) return;

    if (prefersReducedMotion) {
      setCount(value);
      return;
    }

    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hasIntersected, value, duration, prefersReducedMotion]);

  return (
    <p ref={ref} className={cn("tabular-nums", className)} aria-label={`${prefix}${value}${suffix}`}>
      <span aria-hidden="true">
        {prefix}{count}{suffix}
      </span>
    </p>
  );
}

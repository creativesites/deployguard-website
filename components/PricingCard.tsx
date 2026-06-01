import Link from 'next/link'
import clsx from 'clsx'
import Button from '@/components/ui/Button'
import { Check } from 'lucide-react'

export interface PricingTier {
  name: string
  price: string
  annualPrice?: string
  guardLimit: string
  description: string
  features: string[]
  cta: string
  ctaHref: string
  highlighted?: boolean
  badge?: string
}

export default function PricingCard({
  tier,
  annual,
}: {
  tier: PricingTier
  annual: boolean
}) {
  const price = annual && tier.annualPrice ? tier.annualPrice : tier.price

  return (
    <div
      className={clsx(
        'relative flex flex-col rounded-2xl border p-8 transition-shadow',
        tier.highlighted
          ? 'border-primary bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
          : 'border-border bg-surface shadow-card hover:shadow-card-hover'
      )}
    >
      {tier.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {tier.badge}
          </span>
        </div>
      )}

      <div className="mb-6">
        <p className={clsx('text-sm font-semibold uppercase tracking-widest mb-2',
          tier.highlighted ? 'text-blue-200' : 'text-muted'
        )}>
          {tier.name}
        </p>
        <div className="flex items-end gap-1 mb-1">
          <span className="text-4xl font-bold">{price}</span>
          {price !== 'Custom' && (
            <span className={clsx('text-sm mb-1.5',
              tier.highlighted ? 'text-blue-200' : 'text-muted'
            )}>
              /{annual ? 'mo, billed annually' : 'mo'}
            </span>
          )}
        </div>
        <p className={clsx('text-xs', tier.highlighted ? 'text-blue-200' : 'text-muted')}>
          Up to {tier.guardLimit}
        </p>
        <p className={clsx('text-sm mt-3', tier.highlighted ? 'text-blue-100' : 'text-muted')}>
          {tier.description}
        </p>
      </div>

      <ul className="space-y-3 flex-1 mb-8">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <Check
              className={clsx('w-4 h-4 mt-0.5 shrink-0',
                tier.highlighted ? 'text-white' : 'text-accent'
              )}
            />
            <span className={tier.highlighted ? 'text-blue-50' : 'text-foreground'}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link href={tier.ctaHref}>
        <Button
          variant={tier.highlighted ? 'secondary' : 'outline'}
          className="w-full justify-center"
          size="md"
        >
          {tier.cta}
        </Button>
      </Link>
    </div>
  )
}

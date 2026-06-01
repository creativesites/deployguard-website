import clsx from 'clsx'

export interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  tier?: 'all' | 'professional' | 'enterprise'
}

export default function FeatureCard({ icon, title, description, tier = 'all' }: Feature) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:shadow-card-hover transition-shadow group">
      <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
        <span className="text-primary group-hover:text-white transition-colors">
          {icon}
        </span>
      </div>
      <h3 className="font-semibold text-foreground text-base mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
      {tier !== 'all' && (
        <div className="mt-4">
          <span className={clsx(
            'text-xs font-semibold px-2 py-0.5 rounded-full',
            tier === 'professional' ? 'bg-accent-light text-accent' : 'bg-amber-100 text-amber-700'
          )}>
            {tier === 'professional' ? 'Professional+' : 'Enterprise'}
          </span>
        </div>
      )}
    </div>
  )
}

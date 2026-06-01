import clsx from 'clsx'

type Color = 'blue' | 'teal' | 'yellow' | 'red' | 'gray' | 'green'

const colorClasses: Record<Color, string> = {
  blue:   'bg-primary-light text-primary',
  teal:   'bg-accent-light text-accent',
  yellow: 'bg-amber-100 text-amber-700',
  red:    'bg-red-100 text-danger',
  gray:   'bg-gray-100 text-muted',
  green:  'bg-green-100 text-success',
}

export default function Badge({
  children,
  color = 'gray',
  className,
}: {
  children: React.ReactNode
  color?: Color
  className?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        colorClasses[color],
        className
      )}
    >
      {children}
    </span>
  )
}

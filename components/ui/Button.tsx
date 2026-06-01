import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?:    Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-[0.98]',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm active:scale-[0.98]',
  outline:   'border-2 border-primary text-primary bg-transparent hover:bg-primary-light active:scale-[0.98]',
  ghost:     'text-foreground bg-transparent hover:bg-muted active:scale-[0.98]',
  danger:    'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm active:scale-[0.98]',
}

const sizeClasses: Record<Size, string> = {
  sm:  'px-3 py-1.5 text-sm rounded-md',
  md:  'px-5 py-2.5 text-sm rounded-lg',
  lg:  'px-7 py-3.5 text-base rounded-xl',
}

export default function Button({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path  className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

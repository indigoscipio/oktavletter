import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-amber text-ink hover:brightness-110 active:brightness-95',
  secondary: 'bg-midnight text-white hover:brightness-110 active:brightness-95 dark:bg-stone-800',
  outline: 'border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
  ghost: 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]',
  destructive: 'bg-destructive-500 text-white hover:bg-destructive-600',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-full font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
}

export default function Input({
  label,
  leftIcon,
  rightIcon,
  error,
  helperText,
  className = '',
  ...props
}) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      {label ? (
        <span className="block text-sm font-medium text-[var(--text-primary)]">{label}</span>
      ) : null}
      <div className="relative">
        {leftIcon ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {leftIcon}
          </span>
        ) : null}
        <input
          className={`w-full rounded-xl border bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] outline-none transition-colors duration-150 placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-amber/30 ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${
            error ? 'border-destructive-500' : 'border-[var(--border)]'
          }`}
          {...props}
        />
        {rightIcon ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {rightIcon}
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="text-sm text-destructive-500">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-[var(--text-muted)]">{helperText}</p>
      ) : null}
    </label>
  )
}

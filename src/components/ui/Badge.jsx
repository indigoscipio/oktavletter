const variants = {
  ready: 'bg-midnight text-white dark:bg-stone-700',
  waiting: 'bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-300',
  opened: 'bg-amber/15 text-amber',
}

export default function Badge({ variant = 'waiting', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

import Button from './ui/Button'

export default function EmptyState({ title, children, icon, actionLabel, onAction }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
      {icon ? (
        <div className="mb-3 flex justify-center text-[var(--text-muted)]">{icon}</div>
      ) : null}
      <h3 className="text-lg font-medium text-[var(--text-primary)]">{title}</h3>
      {children ? (
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{children}</p>
      ) : null}
      {actionLabel && onAction ? (
        <div className="mt-4">
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

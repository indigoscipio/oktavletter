export default function EmptyState({ title, children, icon, actionLabel, onAction }) {
  return (
    <div className="rounded-xl border border-dashed border-black/15 p-6 text-center">
      {icon ? <div className="mb-3 flex justify-center text-stone">{icon}</div> : null}
      <h3 className="text-lg text-ink">{title}</h3>
      {children ? <p className="mt-2 text-sm text-stone">{children}</p> : null}
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction} className="mt-4 rounded-full bg-amber px-4 py-2 text-sm text-ink">
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

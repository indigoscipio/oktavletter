export default function EmptyState({ title, children }) {
  return (
    <div className="rounded-xl border border-dashed border-black/15 p-6 text-center">
      <h3 className="text-lg text-ink">{title}</h3>
      {children ? <p className="mt-2 text-sm text-stone">{children}</p> : null}
    </div>
  )
}

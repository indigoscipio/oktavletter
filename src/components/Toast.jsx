export default function Toast({ message }) {
  if (!message) return null

  return (
    <div className="fixed inset-x-4 bottom-28 z-10 mx-auto max-w-xl animate-[fadeIn_0.2s_ease]">
      <div className="rounded-xl border border-amber/30 bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-primary)] shadow-lg">
        {message}
      </div>
    </div>
  )
}

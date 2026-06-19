export default function Toast({ message }) {
  if (!message) return null

  return (
    <div className="fixed inset-x-4 bottom-24 z-10 mx-auto max-w-xl rounded-xl border border-amber/30 bg-white p-4 text-sm text-ink shadow-lg">
      {message}
    </div>
  )
}

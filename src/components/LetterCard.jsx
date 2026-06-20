import { formatDate, formatLongDate, getDaysUntil, getLetterState } from '../utils/dates'

export default function LetterCard({ letter, onOpen }) {
  const state = getLetterState(letter)
  const days = getDaysUntil(letter.openDate)

  const description = {
    opened: `Opened ${formatDate(letter.openedAt)}`,
    ready: 'Ready to open',
    waiting: letter.emailReminder
      ? `Email reminder set for ${formatLongDate(letter.openDate)}`
      : days === 1
        ? 'Opens tomorrow'
        : `Opens in ${days} days`,
  }[state]

  return (
    <button
      type="button"
      onClick={() => onOpen(letter.id)}
      className="w-full rounded-xl border border-black/10 bg-white p-4 text-left"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg text-ink">{letter.title}</h3>
          <p className="mt-1 text-sm text-stone">{description}</p>
          <p className="mt-1 text-xs text-stone">Open date: {formatDate(letter.openDate)}</p>
        </div>
        <span className="rounded-full border border-amber/40 px-2 py-1 text-xs text-amber">{state}</span>
      </div>
    </button>
  )
}

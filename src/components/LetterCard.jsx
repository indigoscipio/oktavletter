import { ChevronRight, Lock, CheckCircle, Mail } from 'lucide-react'
import { formatDate, formatLongDate, getDaysUntil, getLetterState } from '../utils/dates'
import Badge from './ui/Badge'

export default function LetterCard({ letter, onOpen }) {
  const state = getLetterState(letter)
  const days = getDaysUntil(letter.openDate)

  return (
    <button
      type="button"
      onClick={() => onOpen(letter.id)}
      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 text-left transition-all duration-150 hover:border-amber/40 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-medium text-[var(--text-primary)]">
            {letter.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
            {state === 'opened' && <CheckCircle size={14} className="shrink-0 text-amber" />}
            {state === 'ready' && <Mail size={14} className="shrink-0 text-amber" />}
            {state === 'waiting' && <Lock size={14} className="shrink-0 text-[var(--text-muted)]" />}
            <span>
              {state === 'opened' && `Opened ${formatDate(letter.openedAt)}`}
              {state === 'ready' && 'Ready to open'}
              {state === 'waiting' && (
                letter.emailReminder
                  ? `Opens ${formatLongDate(letter.openDate)}`
                  : days === 1
                    ? 'Opens tomorrow'
                    : `Opens in ${days} days`
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={state}>{state}</Badge>
          <ChevronRight size={16} className="text-[var(--text-muted)]" />
        </div>
      </div>
    </button>
  )
}

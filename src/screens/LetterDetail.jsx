import { ArrowLeft, Lock, Mail, Calendar } from 'lucide-react'
import { formatDate, formatLongDate, getDaysUntil, getLetterState } from '../utils/dates'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function LetterDetail({ letter, openLetter, deleteLetter, setView, showToast }) {
  if (!letter) {
    return (
      <main className="space-y-4">
        <p className="text-[var(--text-secondary)]">Letter not found.</p>
        <Button variant="ghost" onClick={() => setView('letters')}>
          Back to Letters
        </Button>
      </main>
    )
  }

  const state = getLetterState(letter)
  const days = getDaysUntil(letter.openDate)

  function handleOpen() {
    openLetter(letter.id)
    showToast('Letter opened.')
  }

  function handleDelete() {
    if (!window.confirm('Delete this letter? This cannot be undone.')) return
    deleteLetter(letter.id)
    setView('letters')
    showToast('Letter deleted.')
  }

  return (
    <main className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft size={16} />}
        onClick={() => setView('letters')}
      >
        Back to Letters
      </Button>

      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant={state}>{state}</Badge>
        </div>
        <p className="text-sm text-[var(--text-muted)]">Written {formatDate(letter.writtenAt)}</p>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{letter.title}</h1>
      </header>

      {state === 'waiting' && (
        <Card className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-stone-200 p-3 dark:bg-stone-700">
              <Lock size={24} className="text-[var(--text-secondary)]" />
            </div>
          </div>
          <p className="text-lg font-medium text-[var(--text-primary)]">This letter is sealed.</p>
          <p className="text-sm text-[var(--text-secondary)]">
            It opens on {formatLongDate(letter.openDate)}
            {days > 0 ? `, in ${days} days.` : '.'}
          </p>
        </Card>
      )}

      {state === 'ready' && (
        <Card className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-amber/15 p-3">
              <Mail size={24} className="text-amber" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium text-[var(--text-primary)]">This letter is ready.</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Break the seal when you are ready to read it.
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={handleOpen}>
            Break the Seal
          </Button>
        </Card>
      )}

      {state === 'opened' && (
        <Card className="whitespace-pre-wrap leading-7 text-[var(--text-primary)]">
          {letter.content}
        </Card>
      )}

      {letter.emailReminder && (
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Mail size={14} />
          <span>Reminder: {letter.emailReminder}</span>
        </div>
      )}

      <div className="h-px bg-[var(--border)]" />

      <Button variant="ghost" size="sm" className="text-destructive-500" onClick={handleDelete}>
        Delete Letter
      </Button>
    </main>
  )
}

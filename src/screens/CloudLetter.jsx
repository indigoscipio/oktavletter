import { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Mail, Lock } from 'lucide-react'
import { getCloudLetter } from '../utils/api'
import { decryptLetterPayload } from '../utils/crypto'
import { formatDate, formatLongDate } from '../utils/dates'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function CloudLetter({ cloudLetterId, setView, showToast, openLetter, localLetterId }) {
  const [decryptedLetter, setDecryptedLetter] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [openDate, setOpenDate] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadLetter() {
      try {
        const letter = await getCloudLetter(cloudLetterId)

        if (cancelled) return

        if (letter.status === 'waiting') {
          setOpenDate(letter.openDate)
          setIsLoading(false)
          return
        }

        if (!letter.unlockKey) {
          throw new Error('This letter was created with an older version of Algernon and cannot be opened here.')
        }

        const payload = await decryptLetterPayload(letter, letter.unlockKey)
        if (!cancelled) {
          setDecryptedLetter(payload)
          if (localLetterId) openLetter(localLetterId)
          showToast('Letter opened.')
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadLetter()

    return () => {
      cancelled = true
    }
  }, [cloudLetterId])

  if (isLoading) {
    return (
      <main className="space-y-4 py-8">
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber border-t-transparent" />
        </div>
        <p className="text-center text-sm text-[var(--text-muted)]">Loading letter...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="space-y-4">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Letter not found.</h1>
        <p className="text-[var(--text-secondary)]">
          This link may be wrong, or the letter may no longer exist.
        </p>
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => setView('letters')}
        >
          Back to Letters
        </Button>
      </main>
    )
  }

  if (openDate) {
    return (
      <main className="space-y-6">
        <Card className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-stone-200 p-3 dark:bg-stone-700">
              <Lock size={24} className="text-[var(--text-secondary)]" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">You are early.</h1>
            <p className="text-[var(--text-secondary)]">
              This letter opens on {formatLongDate(openDate)}.
            </p>
          </div>
        </Card>
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => setView('letters')}
        >
          Back to Letters
        </Button>
      </main>
    )
  }

  if (!decryptedLetter) {
    return (
      <main className="space-y-4">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Could not open letter.</h1>
        <p className="text-[var(--text-secondary)]">The link may be incorrect.</p>
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => setView('letters')}
        >
          Back to Letters
        </Button>
      </main>
    )
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

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="opened">Opened</Badge>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          Written {formatDate(decryptedLetter.writtenAt)}
        </p>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          {decryptedLetter.title}
        </h1>
        <div className="h-px bg-[var(--border)]" />
        <div className="whitespace-pre-wrap leading-7 text-[var(--text-primary)]">
          {decryptedLetter.content}
        </div>
        <div className="h-px bg-[var(--border)]" />
        <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
          {decryptedLetter.openDate && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              Opens {formatDate(decryptedLetter.openDate)}
            </span>
          )}
        </div>
        <p className="text-center text-xs text-[var(--text-muted)]">
          algernon · fully private &amp; encrypted
        </p>
      </Card>
    </main>
  )
}

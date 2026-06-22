import { useEffect, useState } from 'react'
import { getCloudLetter } from '../utils/api'
import { decryptLetterPayload } from '../utils/crypto'
import { formatDate, formatLongDate } from '../utils/dates'

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
    return <main className="text-stone">Loading letter...</main>
  }

  if (error) {
    return (
      <main className="space-y-4">
        <h1 className="text-3xl text-ink">Letter not found.</h1>
        <p className="text-stone">This link may be wrong, or the letter may no longer exist.</p>
        <button type="button" onClick={() => setView('letters')} className="text-amber">
          Back to letters
        </button>
      </main>
    )
  }

  if (openDate) {
    return (
      <main className="space-y-4">
        <h1 className="text-3xl text-ink">You are early.</h1>
        <p className="text-stone">This letter opens on {formatLongDate(openDate)}.</p>
        <button type="button" onClick={() => setView('letters')} className="text-amber">
          Back to letters
        </button>
      </main>
    )
  }

  if (!decryptedLetter) {
    return (
      <main className="space-y-4">
        <h1 className="text-3xl text-ink">Could not open letter.</h1>
        <p className="text-stone">The link may be incorrect.</p>
        <button type="button" onClick={() => setView('letters')} className="text-amber">
          Back to letters
        </button>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <article className="space-y-4 rounded-xl border border-black/10 bg-white p-5 text-ink">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-stone">Opened</p>
          <h1 className="text-3xl">{decryptedLetter.title}</h1>
          <p className="text-sm text-stone">Written {formatDate(decryptedLetter.writtenAt)}</p>
        </header>
        <div className="whitespace-pre-wrap leading-7">{decryptedLetter.content}</div>
      </article>
    </main>
  )
}

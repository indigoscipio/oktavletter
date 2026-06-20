import { useEffect, useState } from 'react'
import { getCloudLetter } from '../utils/api'
import { decryptLetterPayload } from '../utils/crypto'
import { formatDate } from '../utils/dates'

export default function CloudLetter({ cloudLetterId, setView, showToast }) {
  const [cloudLetter, setCloudLetter] = useState(null)
  const [decryptedLetter, setDecryptedLetter] = useState(null)
  const [passphrase, setPassphrase] = useState('')
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isUnlocking, setIsUnlocking] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadLetter() {
      try {
        const letter = await getCloudLetter(cloudLetterId)
        if (!cancelled) setCloudLetter(letter)
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

  async function unlockLetter(event) {
    event.preventDefault()
    setError('')

    if (!passphrase.trim()) {
      setError('Enter your unlock phrase.')
      return
    }

    setIsUnlocking(true)
    try {
      const payload = await decryptLetterPayload(cloudLetter, passphrase)
      setDecryptedLetter(payload)
      showToast('Letter unlocked.')
    } catch {
      setError('That unlock phrase did not work.')
    } finally {
      setIsUnlocking(false)
    }
  }

  if (isLoading) {
    return <main className="text-stone">Loading letter...</main>
  }

  if (error && !cloudLetter) {
    return (
      <main className="space-y-4">
        <p className="text-stone">{error}</p>
        <button type="button" onClick={() => setView('letters')} className="text-amber">
          Back to letters
        </button>
      </main>
    )
  }

  if (cloudLetter.status === 'waiting') {
    return (
      <main className="space-y-4">
        <h1 className="text-3xl text-ink">This letter is still sealed.</h1>
        <p className="text-stone">It opens on {formatDate(cloudLetter.openDate)}.</p>
        <button type="button" onClick={() => setView('letters')} className="text-amber">
          Back to letters
        </button>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-stone">Ready</p>
        <h1 className="text-3xl text-ink">Your letter is ready.</h1>
        <p className="text-stone">Enter your unlock phrase to decrypt it in this browser.</p>
      </header>

      {!decryptedLetter ? (
        <form onSubmit={unlockLetter} className="space-y-4 rounded-xl border border-black/10 bg-white p-4">
          <label className="block space-y-2">
            <span className="text-sm text-stone">Unlock phrase</span>
            <div className="flex gap-2">
              <input
                type={showPassphrase ? 'text' : 'password'}
                value={passphrase}
                onChange={(event) => setPassphrase(event.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-ink outline-none focus:border-amber"
              />
              <button
                type="button"
                onClick={() => setShowPassphrase((current) => !current)}
                className="rounded-xl border border-black/10 px-4 py-3 text-sm text-stone"
              >
                {showPassphrase ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {error ? <p className="text-sm text-amber">{error}</p> : null}

          <button type="submit" disabled={isUnlocking} className="w-full rounded-full bg-amber px-4 py-3 text-ink disabled:opacity-60">
            {isUnlocking ? 'Unlocking...' : 'Unlock letter'}
          </button>
        </form>
      ) : (
        <article className="space-y-4 rounded-xl border border-black/10 bg-white p-5 text-ink">
          <h2 className="text-2xl">{decryptedLetter.title}</h2>
          <p className="text-sm text-stone">Written {formatDate(decryptedLetter.writtenAt)}</p>
          <div className="whitespace-pre-wrap leading-7">{decryptedLetter.content}</div>
        </article>
      )}
    </main>
  )
}

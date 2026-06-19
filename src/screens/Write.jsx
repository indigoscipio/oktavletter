import { useEffect, useState } from 'react'
import { dateInputToIso, toDateInputValue } from '../utils/dates'
import { createCloudLetter } from '../utils/api'
import { encryptLetterPayload } from '../utils/crypto'
import { validateLetterInput } from '../utils/validation'

const DRAFT_KEY = 'algernon_draft'

function loadDraft() {
  try {
    const stored = localStorage.getItem(DRAFT_KEY)
    return stored ? JSON.parse(stored) : { title: '', content: '', openDate: '' }
  } catch {
    return { title: '', content: '', openDate: '' }
  }
}

export default function Write({ createLetter, setView, setSelectedLetterId, showToast }) {
  const [draft] = useState(loadDraft)
  const [title, setTitle] = useState(draft.title || '')
  const [content, setContent] = useState(draft.content || '')
  const [openDate, setOpenDate] = useState(draft.openDate || '')
  const [email, setEmail] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [error, setError] = useState('')
  const [isSealing, setIsSealing] = useState(false)

  useEffect(() => {
    const hasDraft = title.trim() || content.trim() || openDate
    if (hasDraft) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, openDate }))
    } else {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [title, content, openDate])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const validationError = validateLetterInput({ title, content, openDate })
    if (validationError) {
      setError(validationError)
      return
    }

    if (!email.trim().includes('@')) {
      setError('Enter an email address.')
      return
    }

    if (passphrase.trim().length < 8) {
      setError('Use an unlock phrase with at least 8 characters.')
      return
    }

    setIsSealing(true)

    try {
      const openDateIso = dateInputToIso(openDate)
      const now = new Date().toISOString()
      const encrypted = await encryptLetterPayload(
        {
          title: title.trim(),
          content: content.trim(),
          writtenAt: now,
          openDate: openDateIso,
          createdAt: now,
        },
        passphrase,
      )
      const cloudLetter = await createCloudLetter({ email: email.trim(), openDate, ...encrypted })

      const letter = createLetter({ title, content, openDate, cloudId: cloudLetter.id, emailReminder: email.trim() })
      localStorage.removeItem(DRAFT_KEY)
      setSelectedLetterId(letter.id)
      setView('sealed')
      showToast('Your letter is sealed. We will email you when it opens.')
    } catch (sealError) {
      setError(sealError.message)
    } finally {
      setIsSealing(false)
    }
  }

  function discardDraft() {
    if (!title.trim() && !content.trim() && !openDate) return
    if (!window.confirm('Discard this draft?')) return

    setTitle('')
    setContent('')
    setOpenDate('')
    setError('')
    localStorage.removeItem(DRAFT_KEY)
    showToast('Draft discarded.')
  }

  return (
    <main>
      <header className="mb-6 space-y-2">
        <h1 className="text-3xl text-ink">Write a letter</h1>
        <p className="text-stone">Plain text only. Once sealed, it cannot be read until the open date.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4 rounded-xl border border-black/10 bg-white p-4">
          <p className="text-sm leading-6 text-stone">
            Algernon will email you when the letter opens. Your letter is encrypted in this browser before upload.
          </p>
          <label className="block space-y-2">
            <span className="text-sm text-stone">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink outline-none focus:border-amber"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-stone">Unlock phrase</span>
            <div className="flex gap-2">
              <input
                type={showPassphrase ? 'text' : 'password'}
                value={passphrase}
                onChange={(event) => setPassphrase(event.target.value)}
                placeholder="Needed later to read the letter"
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
          <div className="rounded-xl border border-amber/40 bg-amber/10 p-3 text-sm leading-6 text-ink">
            <strong>Important:</strong> if you forget this phrase, this letter cannot be opened. We cannot recover it.
          </div>
        </div>

        <label className="block space-y-2">
          <span className="text-sm text-stone">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="To myself, one year from now"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink outline-none focus:border-amber"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-stone">Open date</span>
          <input
            type="date"
            min={toDateInputValue(new Date(Date.now() + 86400000))}
            value={openDate}
            onChange={(event) => setOpenDate(event.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink outline-none focus:border-amber"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-stone">Letter</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={12}
            placeholder="Write honestly. No one else needs to read this."
            className="w-full resize-y rounded-xl border border-black/10 bg-white px-4 py-3 text-ink outline-none focus:border-amber"
          />
        </label>

        {error ? <p className="text-sm text-amber">{error}</p> : null}

        <button type="submit" disabled={isSealing} className="w-full rounded-full bg-amber px-4 py-3 text-ink disabled:opacity-60">
          {isSealing ? 'Sealing...' : 'Seal letter'}
        </button>
        <button type="button" onClick={discardDraft} className="w-full rounded-full border border-black/10 px-4 py-3 text-stone">
          Discard draft
        </button>
      </form>
    </main>
  )
}

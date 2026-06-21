import { useEffect, useState } from 'react'
import { dateInputToIso, toDateInputValue } from '../utils/dates'
import { createCloudLetter } from '../utils/api'
import { encryptLetterPayload } from '../utils/crypto'
import { validateLetterInput } from '../utils/validation'

const DRAFT_KEY = 'algernon_draft'

function generateKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return btoa(String.fromCharCode(...bytes))
}

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

    setIsSealing(true)

    try {
      const openDateIso = dateInputToIso(openDate)
      const now = new Date().toISOString()
      const key = generateKey()
      const encrypted = await encryptLetterPayload(
        {
          title: title.trim(),
          content: content.trim(),
          writtenAt: now,
          openDate: openDateIso,
          createdAt: now,
        },
        key,
      )
      const cloudLetter = await createCloudLetter({ email: email.trim(), openDate, ...encrypted, unlockKey: key })

      const letter = createLetter({ title, content, openDate, cloudId: cloudLetter.id, emailReminder: email.trim(), key })
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
          <span className="block text-sm text-stone">Algernon will email you sometime on this date.</span>
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

        <div className="space-y-4 rounded-xl border border-black/10 bg-white p-4">
          <p className="text-sm leading-6 text-stone">
            Algernon will email you when the letter opens. Your letter is encrypted before upload.
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
        </div>

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

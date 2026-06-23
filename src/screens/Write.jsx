import { useEffect, useState } from 'react'
import { Eye, Pencil, Calendar, Mail, Type } from 'lucide-react'
import { dateInputToIso, toDateInputValue, formatDate } from '../utils/dates'
import { createCloudLetter } from '../utils/api'
import { encryptLetterPayload } from '../utils/crypto'
import { validateLetterInput } from '../utils/validation'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

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
  const [showPreview, setShowPreview] = useState(false)

  const canPreview = title.trim() && content.trim()

  useEffect(() => {
    const hasDraft = title.trim() || content.trim() || openDate
    if (hasDraft) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, content, openDate }))
    } else {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [title, content, openDate])

  async function handleSubmit(event) {
    event?.preventDefault()
    setShowPreview(false)
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

  if (showPreview) {
    return (
      <main className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">View Letter</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            When opened, this is the letter that you will receive.
          </p>
        </header>

        <Card className="space-y-4">
          <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
            <span className="font-medium">algernon</span>
            <span>{formatDate(new Date().toISOString())}</span>
          </div>
          <div className="h-px bg-[var(--border)]" />
          {title.trim() ? (
            <h2 className="text-xl font-medium text-[var(--text-primary)]">{title.trim()}</h2>
          ) : null}
          <div className="whitespace-pre-wrap leading-7 text-[var(--text-primary)]">
            {content.trim()}
          </div>
          <div className="h-px bg-[var(--border)]" />
          <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
            {openDate ? (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                Opens {formatDate(openDate)}
              </span>
            ) : null}
            {email ? (
              <span className="flex items-center gap-1.5">
                <Mail size={14} />
                {email}
              </span>
            ) : null}
          </div>
          <p className="text-center text-xs text-[var(--text-muted)]">
            algernon · encrypted in transit and at rest
          </p>
        </Card>

        {error ? <p className="text-sm text-destructive-500">{error}</p> : null}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSealing}
          onClick={() => handleSubmit(null)}
        >
          {isSealing ? 'Sealing...' : 'Seal Letter'}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          leftIcon={<Pencil size={16} />}
          onClick={() => setShowPreview(false)}
        >
          Edit Letter
        </Button>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Write Letter</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Plain text only. Once sealed, it cannot be read until the open date.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          leftIcon={<Type size={16} />}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="To myself, one year from now"
        />

        <label className="block space-y-1.5">
          <span className="block text-sm font-medium text-[var(--text-primary)]">Letter</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Write honestly. No one else needs to read this."
            className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] outline-none transition-colors duration-150 placeholder:text-[var(--text-muted)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-amber/30"
          />
          <span className="block text-right text-xs text-[var(--text-muted)]">
            {content.length} characters
          </span>
        </label>

        <Input
          label="Open Date"
          type="date"
          leftIcon={<Calendar size={16} />}
          min={toDateInputValue(new Date(Date.now() + 86400000))}
          value={openDate}
          onChange={(e) => setOpenDate(e.target.value)}
        />

        <Input
          label="Email Address"
          type="email"
          leftIcon={<Mail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          helperText="We'll email you when the letter opens."
        />

        {error ? <p className="text-sm text-destructive-500">{error}</p> : null}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSealing}
        >
          {isSealing ? 'Sealing...' : 'Seal Letter'}
        </Button>

        {canPreview ? (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            leftIcon={<Eye size={16} />}
            onClick={() => setShowPreview(true)}
          >
            Preview Letter
          </Button>
        ) : null}

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={discardDraft}
        >
          Discard Draft
        </Button>
      </form>
    </main>
  )
}

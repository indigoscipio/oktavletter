import { formatDate, formatLongDate, getDaysUntil, getLetterState } from '../utils/dates'

export default function LetterDetail({ letter, openLetter, deleteLetter, setView, showToast }) {
  if (!letter) {
    return (
      <main className="space-y-4">
        <p className="text-stone">Letter not found.</p>
        <button type="button" onClick={() => setView('letters')} className="text-amber">
          Back to letters
        </button>
      </main>
    )
  }

  const state = getLetterState(letter)
  const days = getDaysUntil(letter.openDate)

  function handleOpen() {
    openLetter(letter.id)
    showToast('The seal is broken. Your letter is open.')
  }

  function handleDelete() {
    if (!window.confirm('Delete this letter? This cannot be undone.')) return

    deleteLetter(letter.id)
    setView('letters')
    showToast('Letter deleted.')
  }

  return (
    <main className="space-y-6">
      <button type="button" onClick={() => setView('letters')} className="text-sm text-amber">
        Back to letters
      </button>

      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-stone">{state}</p>
        <h1 className="text-3xl text-ink">{letter.title}</h1>
        <p className="text-stone">Written {formatDate(letter.writtenAt)}</p>
      </header>

      {state === 'waiting' ? (
        <section className="rounded-xl border border-black/10 bg-white p-6 text-center">
          <p className="text-lg text-ink">This letter is sealed.</p>
          <p className="mt-2 text-stone">
            It opens on {formatLongDate(letter.openDate)}{days > 0 ? `, in ${days} days.` : '.'}
          </p>
        </section>
      ) : null}

      {state === 'ready' ? (
        <section className="rounded-xl border border-amber/40 bg-white p-6 text-center">
          <p className="text-lg text-ink">This letter is ready.</p>
          <p className="mt-2 text-stone">Break the seal when you are ready to read it.</p>
          <button type="button" onClick={handleOpen} className="mt-5 rounded-full bg-amber px-5 py-3 text-ink">
            Break the seal
          </button>
        </section>
      ) : null}

      {state === 'opened' ? (
        <article className="whitespace-pre-wrap rounded-xl border border-black/10 bg-white p-5 leading-7 text-ink">
          {letter.content}
        </article>
      ) : null}

      <button type="button" onClick={handleDelete} className="text-sm text-stone underline">
        Delete letter
      </button>
    </main>
  )
}

import { List } from 'lucide-react'
import { formatLongDate } from '../utils/dates'

export default function SealComplete({ letter, setView }) {
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

  return (
    <main className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-stone">Sealed</p>
        <h1 className="text-3xl text-ink">Your letter is sealed.</h1>
        <p className="text-stone">
          We will email you on {formatLongDate(letter.openDate)}.
        </p>
        <p className="text-sm text-stone">If you do not see the email that day, check spam or promotions.</p>
      </header>

      <section className="space-y-3 rounded-xl border border-black/10 bg-white p-4">
        <h2 className="text-xl text-ink">Remember your unlock phrase</h2>
        <p className="text-sm leading-6 text-stone">It is the only way to open this letter.</p>

        <button
          type="button"
          onClick={() => setView('letters')}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-amber px-4 py-3 text-ink"
        >
          <List size={18} />
          Back to letters
        </button>
      </section>
    </main>
  )
}

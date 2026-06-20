import EmptyState from '../components/EmptyState'
import LetterCard from '../components/LetterCard'
import { getLetterState } from '../utils/dates'

function Section({ title, letters, onOpen, empty }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm uppercase tracking-[0.2em] text-stone">{title}</h2>
      {letters.length ? (
        letters.map((letter) => <LetterCard key={letter.id} letter={letter} onOpen={onOpen} />)
      ) : (
        <EmptyState title={empty} />
      )}
    </section>
  )
}

export default function Letters({ letters, setView, setSelectedLetterId, setCloudLetterId }) {
  const ready = letters.filter((letter) => getLetterState(letter) === 'ready')
  const waiting = letters.filter((letter) => getLetterState(letter) === 'waiting')
  const opened = letters.filter((letter) => getLetterState(letter) === 'opened')

  function openDetail(id) {
    const letter = letters.find((item) => item.id === id)
    if (letter?.cloudId) {
      setCloudLetterId(letter.cloudId)
      setView('cloud')
      return
    }

    setSelectedLetterId(id)
    setView('detail')
  }

  return (
    <main className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-stone">Algernon</p>
        <h1 className="text-3xl text-ink">Your letters</h1>
        <p className="text-stone">Write a letter, seal it, and come back when the date arrives.</p>
        <button
          type="button"
          onClick={() => setView('write')}
          className="rounded-full bg-amber px-4 py-2 text-sm text-ink"
        >
          Write a letter
        </button>
      </header>

      {letters.length ? (
        <div className="space-y-8">
          <Section title="Ready" letters={ready} onOpen={openDetail} empty="No letters ready yet." />
          <Section title="Waiting" letters={waiting} onOpen={openDetail} empty="No sealed letters waiting." />
          <Section title="Opened" letters={opened} onOpen={openDetail} empty="No opened letters yet." />
        </div>
      ) : (
        <EmptyState title="No letters yet">Start by writing one letter to your future self.</EmptyState>
      )}
    </main>
  )
}

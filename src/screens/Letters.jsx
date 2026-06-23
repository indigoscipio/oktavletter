import { PenLine } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import LetterCard from '../components/LetterCard'
import Button from '../components/ui/Button'
import { getLetterState } from '../utils/dates'

function Section({ title, letters, onOpen }) {
  if (letters.length === 0) return null
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
        {title}
      </h2>
      <div className="space-y-2">
        {letters.map((letter) => (
          <LetterCard key={letter.id} letter={letter} onOpen={onOpen} />
        ))}
      </div>
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

  if (letters.length === 0) {
    return (
      <main className="space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-[var(--text-muted)]">Hello, you!</p>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            What do you want to say to your future?
          </h1>
        </div>
        <EmptyState
          title="No letters yet"
          icon={<PenLine size={32} />}
          actionLabel="Write your first letter"
          onAction={() => setView('write')}
        >
          Your letter is encrypted before upload. Only your unique link can open it.
        </EmptyState>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm text-[var(--text-muted)]">Hello, you!</p>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
          What do you want to say to your future?
        </h1>
      </div>
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={() => setView('write')}
      >
        Write Future Letter
      </Button>
      <div className="space-y-6">
        <Section title="Ready" letters={ready} onOpen={openDetail} />
        <Section title="Waiting" letters={waiting} onOpen={openDetail} />
        <Section title="Opened" letters={opened} onOpen={openDetail} />
      </div>
    </main>
  )
}

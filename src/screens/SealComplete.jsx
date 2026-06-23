import { CheckCircle, ArrowLeft } from 'lucide-react'
import { formatLongDate } from '../utils/dates'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function SealComplete({ letter, setView }) {
  if (!letter) {
    return (
      <main className="space-y-4">
        <p className="text-[var(--text-secondary)]">Letter not found.</p>
        <Button variant="ghost" onClick={() => setView('letters')}>
        Back to Letters
        </Button>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <Card className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-amber/15 p-3">
            <CheckCircle size={24} className="text-amber" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Sealed!</h1>
          <p className="text-[var(--text-secondary)]">
            We will email you on {formatLongDate(letter.openDate)}.
          </p>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          If you do not see the email that day, check spam or promotions.
        </p>
      </Card>

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        leftIcon={<ArrowLeft size={16} />}
        onClick={() => setView('letters')}
      >
        Back to letters
      </Button>
    </main>
  )
}

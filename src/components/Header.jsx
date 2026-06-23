import { Plus } from 'lucide-react'
import Button from './ui/Button'

export default function Header({ setView }) {
  return (
    <header className="mb-6 flex items-center justify-between">
      <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="algernon" className="h-8" />
      <Button
        variant="secondary"
        size="sm"
        leftIcon={<Plus size={16} />}
        onClick={() => setView('write')}
      >
        Write
      </Button>
    </header>
  )
}

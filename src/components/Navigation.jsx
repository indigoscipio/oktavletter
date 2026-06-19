import { Archive, PenLine, Settings } from 'lucide-react'

const items = [
  { id: 'letters', label: 'Letters', icon: Archive },
  { id: 'write', label: 'Write', icon: PenLine },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Navigation({ view, setView }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-black/10 bg-cream/95">
      <div className="mx-auto grid max-w-xl grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          const active = view === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-3 text-sm ${
                active ? 'text-amber' : 'text-stone'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

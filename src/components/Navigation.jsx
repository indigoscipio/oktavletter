import { Archive, PenLine, Settings } from 'lucide-react'

const items = [
  { id: 'letters', label: 'Letters', icon: Archive },
  { id: 'write', label: 'Write', icon: PenLine },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Navigation({ view, setView }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-sm">
      <div className="mx-auto grid max-w-xl grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          const active = view === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-3 text-xs font-medium transition-colors duration-150 ${
                active
                  ? 'text-amber'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-amber" />
              )}
              <Icon size={20} aria-hidden="true" />
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

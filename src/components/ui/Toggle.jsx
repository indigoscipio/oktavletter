export default function Toggle({ checked, onChange, label, labelClassName = '', className = '' }) {
  return (
    <label className={`flex items-center justify-between gap-4 ${className}`}>
      {label ? (
        <span className={`text-[var(--text-primary)] ${labelClassName}`}>{label}</span>
      ) : null}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
          checked ? 'bg-amber' : 'bg-stone-300 dark:bg-stone-600'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          } mt-0.5`}
        />
      </button>
    </label>
  )
}

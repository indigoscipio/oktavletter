export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

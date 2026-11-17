const TONES = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  danger: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  brand: 'bg-brand-50 text-brand-700 ring-brand-500/20',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-500/20',
}

export default function StatusBadge({ tone = 'neutral', children, dot = true }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${TONES[tone] || TONES.neutral}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  )
}

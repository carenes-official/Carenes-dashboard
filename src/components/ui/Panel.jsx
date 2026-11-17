export default function Panel({ title, description, extra, children, className = '', bodyClassName = '' }) {
  return (
    <section className={`surface ${className}`}>
      {(title || extra) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
          </div>
          {extra && <div className="flex flex-wrap items-center gap-2">{extra}</div>}
        </header>
      )}
      <div className={bodyClassName || 'p-5 sm:p-6'}>{children}</div>
    </section>
  )
}

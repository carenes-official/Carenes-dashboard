export default function DetailGrid({ items }) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ label, value }) => (
        <div key={label} className="min-w-0 rounded-xl bg-slate-50/70 px-4 py-3 ring-1 ring-inset ring-slate-100">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
          <dd className="mt-1 break-words text-sm font-medium text-slate-900">
            {value === undefined || value === null || value === '' ? (
              <span className="font-normal text-slate-400">Not provided</span>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

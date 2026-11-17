import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { HiArrowLeft } from 'react-icons/hi2'

export default function PageHeader({ title, subtitle, count, actions, back = false }) {
  const navigate = useNavigate()

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {back && (
          <Button
            aria-label="Go back"
            icon={<HiArrowLeft />}
            onClick={() => navigate(-1)}
            className="mt-0.5 shrink-0"
          />
        )}
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 truncate text-[22px] font-semibold tracking-tight text-slate-900">
            {title}
            {typeof count === 'number' && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {count.toLocaleString('de-DE')}
              </span>
            )}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

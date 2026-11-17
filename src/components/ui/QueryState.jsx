import { Button, Skeleton } from 'antd'
import { HiOutlineExclamationTriangle, HiOutlineInbox } from 'react-icons/hi2'
import { getErrorMessage } from '../../Redux/baseApis'

export function LoadingBlock({ rows = 6 }) {
  return (
    <div className="surface p-6">
      <Skeleton active paragraph={{ rows }} />
    </div>
  )
}

export function ErrorState({ error, onRetry, title = 'Could not load data' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-2xl text-rose-600">
        <HiOutlineExclamationTriangle />
      </span>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">
          {getErrorMessage(error, 'Please check your connection and try again.')}
        </p>
      </div>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-400">
        <HiOutlineInbox />
      </span>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}

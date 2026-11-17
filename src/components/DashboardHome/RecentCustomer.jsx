import { Link } from 'react-router-dom'
import { Skeleton } from 'antd'
import { HiOutlineMapPin, HiArrowRight } from 'react-icons/hi2'
import { useGetAllCustomersQuery } from '../../Redux/customerApis'
import { fullName } from '../../lib/format'
import Panel from '../ui/Panel'
import EntityCell from '../ui/EntityCell'
import { EmptyState, ErrorState } from '../ui/QueryState'

export default function RecentCustomer() {
  const { data, isLoading, isError, error, refetch } = useGetAllCustomersQuery({ page: 1, limit: 6 })
  const customers = data?.data?.result ?? []

  return (
    <Panel
      title="Recent customers"
      extra={
        <Link to="/customers" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-700">
          View all <HiArrowRight className="h-4 w-4" />
        </Link>
      }
      bodyClassName="px-3 py-2"
    >
      {isLoading ? (
        <div className="p-3">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </div>
      ) : isError && !data ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : customers.length === 0 ? (
        <EmptyState title="No customers yet" />
      ) : (
        <ul className="divide-y divide-slate-100">
          {customers.map((c) => (
            <li key={c._id} className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 hover:bg-slate-50">
              <EntityCell image={c.profile_image} name={fullName(c.firstName, c.lastName) || c.email} subtitle={c.email} />
              <span className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
                <HiOutlineMapPin className="h-3.5 w-3.5" />
                {c.city || '—'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

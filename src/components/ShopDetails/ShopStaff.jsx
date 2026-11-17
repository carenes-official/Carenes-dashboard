import { useState } from 'react'
import { Skeleton } from 'antd'
import { HiOutlineStar } from 'react-icons/hi2'
import { useGetOneShopAllStaffQuery, useGetOneShopBusinessHourQuery } from '../../Redux/shopApis'
import { averageRating, rowNumber } from '../../lib/format'
import DataTable from '../ui/DataTable'
import EntityCell from '../ui/EntityCell'
import StatusBadge from '../ui/StatusBadge'
import { EmptyState, ErrorState } from '../ui/QueryState'

const LIMIT = 6
const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function BusinessHours({ shopId }) {
  const { data, isLoading, isError, error, refetch } = useGetOneShopBusinessHourQuery({
    entityId: shopId,
    entityType: 'Shop',
  })

  if (isLoading) return <Skeleton active paragraph={{ rows: 7 }} title={false} />
  if (isError && !data) return <ErrorState error={error} onRetry={refetch} />

  const hours = [...(data?.data ?? [])].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  )
  if (!hours.length) return <EmptyState title="No opening hours set" />

  return (
    <ul className="divide-y divide-slate-100 rounded-xl ring-1 ring-inset ring-slate-100">
      {hours.map((h) => (
        <li key={h._id || h.day} className="flex items-center justify-between px-4 py-2.5 text-sm">
          <span className="font-medium text-slate-700">{h.day}</span>
          {h.isClosed ? (
            <StatusBadge tone="neutral">Closed</StatusBadge>
          ) : (
            <span className="tabular-nums text-slate-600">
              {h.openTime} – {h.closeTime}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

export default function ShopStaff({ shopId }) {
  const [page, setPage] = useState(1)
  const query = useGetOneShopAllStaffQuery({ page, limit: LIMIT, shop: shopId })

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 56,
      render: (_, __, i) => <span className="text-slate-400">{rowNumber(page, LIMIT, i)}</span>,
    },
    {
      title: 'Staff member',
      key: 'name',
      render: (_, s) => <EntityCell image={s.profile_image} name={s.name} subtitle={s.specialty} />,
    },
    {
      title: 'Rating',
      key: 'rating',
      width: 110,
      render: (_, s) => {
        const r = averageRating(s.totalRating, s.totalRatingCount)
        return r ? (
          <span className="inline-flex items-center gap-1 font-medium">
            <HiOutlineStar className="h-4 w-4 text-amber-500" /> {r}
          </span>
        ) : (
          <span className="text-slate-400">No ratings</span>
        )
      },
    },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Team</h3>
        <DataTable
          columns={columns}
          dataSource={query.data?.data?.result ?? []}
          query={query}
          page={page}
          limit={LIMIT}
          onPageChange={setPage}
          emptyTitle="No staff added yet"
          scrollX={420}
        />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Opening hours</h3>
        <BusinessHours shopId={shopId} />
      </div>
    </div>
  )
}

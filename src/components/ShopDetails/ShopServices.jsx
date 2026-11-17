import { useState } from 'react'
import { useGetAllServiceFromOneShopQuery } from '../../Redux/shopApis'
import { formatCurrency, rowNumber } from '../../lib/format'
import DataTable from '../ui/DataTable'

const LIMIT = 8

export default function ShopServices({ shopId }) {
  const [page, setPage] = useState(1)
  const query = useGetAllServiceFromOneShopQuery({ page, limit: LIMIT, shop: shopId })

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 56,
      render: (_, __, i) => <span className="text-slate-400">{rowNumber(page, LIMIT, i)}</span>,
    },
    {
      title: 'Service',
      dataIndex: 'serviceName',
      key: 'name',
      render: (v) => <span className="font-medium text-slate-900">{v || '—'}</span>,
    },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (v) => (v != null ? formatCurrency(v) : '—') },
    {
      title: 'Duration',
      dataIndex: 'durationMinutes',
      key: 'duration',
      render: (v) => (v ? `${v} min` : '—'),
    },
    {
      title: 'Sales',
      dataIndex: 'totalSales',
      key: 'sales',
      align: 'right',
      render: (v) => <span className="tabular-nums">{formatCurrency(v)}</span>,
    },
  ]

  return (
    <DataTable
      columns={columns}
      dataSource={query.data?.data?.result ?? []}
      query={query}
      page={page}
      limit={LIMIT}
      onPageChange={setPage}
      emptyTitle="This shop has no services yet"
      scrollX={560}
    />
  )
}

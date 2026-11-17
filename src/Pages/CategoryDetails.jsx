import { Select } from 'antd'
import { useLocation, useParams } from 'react-router-dom'
import { useGetOneServiceQuery } from '../Redux/serviceApis'
import useTableQuery from '../hooks/useTableQuery'
import { formatCurrency, rowNumber } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import SearchInput from '../components/ui/SearchInput'
import DataTable from '../components/ui/DataTable'

const SORT_OPTIONS = [
  { value: 'newest', label: 'All services' },
  { value: 'topSelling', label: 'Top selling' },
]

export default function CategoryDetails() {
  const { id } = useParams()
  const { state } = useLocation()
  const t = useTableQuery({ pageSize: 10, filters: { sort: 'newest' } })
  const query = useGetOneServiceQuery({
    shopCategory: id,
    page: t.page,
    limit: t.limit,
    searchTerm: t.searchTerm,
    sort: t.filters.sort === 'topSelling' ? 'topSelling' : undefined,
  })

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 56,
      render: (_, __, i) => <span className="text-slate-400">{rowNumber(t.page, t.limit, i)}</span>,
    },
    {
      title: 'Service',
      dataIndex: 'serviceName',
      key: 'name',
      render: (v) => <span className="font-medium text-slate-900">{v || '—'}</span>,
    },
    { title: 'Shop', key: 'shop', render: (_, s) => s.shop?.shopName || '—' },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (v) => (v != null ? formatCurrency(v) : '—'),
    },
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
      render: (v) => <span className="font-medium tabular-nums">{formatCurrency(v)}</span>,
    },
  ]

  return (
    <div>
      <PageHeader back title={state?.name || 'Category services'} count={query.data?.data?.meta?.total} />
      <Panel
        title="Services"
        bodyClassName="p-0"
        extra={
          <>
            <Select
              value={t.filters.sort}
              onChange={(v) => t.setFilter('sort', v)}
              options={SORT_OPTIONS}
              className="w-36"
              aria-label="Sort services"
            />
            <SearchInput value={t.search} onChange={t.setSearch} placeholder="Search services…" />
          </>
        }
      >
        <DataTable
          columns={columns}
          dataSource={query.data?.data?.result ?? []}
          query={query}
          page={t.page}
          limit={t.limit}
          onPageChange={t.setPage}
          emptyTitle="No services in this category"
        />
      </Panel>
    </div>
  )
}

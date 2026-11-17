import { Select } from 'antd'
import { HiOutlineStar } from 'react-icons/hi2'
import { useGetAllStaffQuery } from '../Redux/staffApis'
import useTableQuery from '../hooks/useTableQuery'
import { averageRating, formatCurrency, rowNumber } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import SearchInput from '../components/ui/SearchInput'
import DataTable from '../components/ui/DataTable'
import EntityCell from '../components/ui/EntityCell'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'topSelling', label: 'Top selling' },
]

export default function Staff() {
  const t = useTableQuery({ pageSize: 10, filters: { sort: 'newest' } })
  const query = useGetAllStaffQuery({
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
      title: 'Staff member',
      key: 'name',
      render: (_, s) => <EntityCell image={s.profile_image} name={s.name} subtitle={s.specialty} />,
    },
    { title: 'Shop', key: 'shop', render: (_, s) => s.shop?.shopName || '—' },
    { title: 'Contact', dataIndex: 'phoneNumber', key: 'phone', render: (v) => v || '—' },
    {
      title: 'Rating',
      key: 'rating',
      width: 100,
      render: (_, s) => {
        const r = averageRating(s.totalRating, s.totalRatingCount)
        return r ? (
          <span className="inline-flex items-center gap-1 font-medium">
            <HiOutlineStar className="h-4 w-4 text-amber-500" />
            {r}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        )
      },
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
      <PageHeader
        title="Staff"
        count={query.data?.data?.meta?.total}
        subtitle="Stylists and team members across all salons."
      />
      <Panel
        title="All staff"
        bodyClassName="p-0"
        extra={
          <>
            <Select
              value={t.filters.sort}
              onChange={(v) => t.setFilter('sort', v)}
              options={SORT_OPTIONS}
              className="w-36"
              aria-label="Sort staff"
            />
            <SearchInput value={t.search} onChange={t.setSearch} placeholder="Search staff…" />
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
          emptyTitle="No staff found"
        />
      </Panel>
    </div>
  )
}

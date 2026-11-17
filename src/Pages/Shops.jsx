import { Select } from 'antd'
import { useGetAllShopQuery } from '../Redux/shopApis'
import useTableQuery from '../hooks/useTableQuery'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import SearchInput from '../components/ui/SearchInput'
import ShopsTable from '../components/shops/ShopsTable'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All shops' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export default function Shops() {
  const t = useTableQuery({ pageSize: 10, filters: { status: 'all' } })
  const query = useGetAllShopQuery({
    page: t.page,
    limit: t.limit,
    searchTerm: t.searchTerm,
    status: t.filters.status === 'all' ? undefined : t.filters.status,
  })

  return (
    <div>
      <PageHeader
        title="Shops"
        count={query.data?.data?.meta?.total}
        subtitle="Manage salons, review their details and control their visibility in the app."
      />
      <Panel
        bodyClassName="p-0"
        title="All shops"
        extra={
          <>
            <Select
              value={t.filters.status}
              onChange={(v) => t.setFilter('status', v)}
              options={STATUS_OPTIONS}
              className="w-36"
              aria-label="Filter by status"
            />
            <SearchInput value={t.search} onChange={t.setSearch} placeholder="Search shop name…" />
          </>
        }
      >
        <ShopsTable query={query} page={t.page} limit={t.limit} onPageChange={t.setPage} />
      </Panel>
    </div>
  )
}

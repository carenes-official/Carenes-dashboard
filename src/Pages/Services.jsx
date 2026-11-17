import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiChevronRight } from 'react-icons/hi2'
import { useGetAllServicesQuery } from '../Redux/serviceApis'
import { formatCurrency, formatNumber, rowNumber } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import DataTable from '../components/ui/DataTable'
import EntityCell from '../components/ui/EntityCell'

const LIMIT = 10

export default function Services() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const query = useGetAllServicesQuery({ page, limit: LIMIT })

  const open = (c) => navigate(`/services/${c._id}`, { state: { name: c.categoryName } })

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 56,
      render: (_, __, i) => <span className="text-slate-400">{rowNumber(page, LIMIT, i)}</span>,
    },
    {
      title: 'Category',
      key: 'name',
      render: (_, c) => <EntityCell image={c.image} name={c.categoryName} shape="square" />,
    },
    {
      title: 'Services',
      dataIndex: 'totalServices',
      key: 'count',
      render: (v) => `${formatNumber(v)} services`,
    },
    {
      title: 'Sales',
      dataIndex: 'totalSales',
      key: 'sales',
      align: 'right',
      render: (v) => <span className="font-medium tabular-nums">{formatCurrency(v)}</span>,
    },
    {
      title: '',
      key: 'go',
      width: 48,
      render: () => <HiChevronRight className="h-4 w-4 text-slate-400" />,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Services"
        count={query.data?.data?.meta?.total}
        subtitle="Service categories with their number of services and recognised sales."
      />
      <Panel bodyClassName="p-0">
        <DataTable
          columns={columns}
          dataSource={query.data?.data?.result ?? []}
          query={query}
          page={page}
          limit={LIMIT}
          onPageChange={setPage}
          emptyTitle="No service categories"
          onRow={(record) => ({ onClick: () => open(record), className: 'cursor-pointer' })}
          scrollX={600}
        />
      </Panel>
    </div>
  )
}

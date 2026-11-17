import { Segmented } from 'antd'
import { useGetAllTransactionsQuery } from '../Redux/transactionApis'
import useTableQuery from '../hooks/useTableQuery'
import { formatCurrency, formatDateTime, fullName, rowNumber } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import DataTable from '../components/ui/DataTable'
import EntityCell from '../components/ui/EntityCell'
import StatusBadge from '../components/ui/StatusBadge'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'Customer', label: 'From customers' },
  { value: 'Client', label: 'From shops' },
]

const partyName = (entity, type) => {
  if (!entity) return 'Deleted account'
  if (type === 'Client') return entity.shopName || fullName(entity.firstName, entity.lastName) || 'Shop'
  return fullName(entity.firstName, entity.lastName) || 'Customer'
}

const partyImage = (entity) => entity?.profile_image || entity?.shopImages?.[0]

export default function Transaction() {
  const t = useTableQuery({ pageSize: 10, filters: { sender: 'all' } })
  const query = useGetAllTransactionsQuery({
    page: t.page,
    limit: t.limit,
    senderEntityType: t.filters.sender === 'all' ? undefined : t.filters.sender,
  })

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 56,
      render: (_, __, i) => <span className="text-slate-400">{rowNumber(t.page, t.limit, i)}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      width: 190,
      render: (v) => <span className="text-slate-600">{formatDateTime(v)}</span>,
    },
    {
      title: 'From',
      key: 'from',
      render: (_, tx) => (
        <EntityCell
          image={partyImage(tx.senderEntityId)}
          name={partyName(tx.senderEntityId, tx.senderEntityType)}
          subtitle={tx.senderEntityType === 'Client' ? 'Shop' : 'Customer'}
        />
      ),
    },
    {
      title: 'To',
      key: 'to',
      render: (_, tx) =>
        tx.receiverEntityId ? (
          <span className="text-slate-700">{partyName(tx.receiverEntityId, tx.receiverEntityType)}</span>
        ) : (
          <span className="text-slate-500">Carenes</span>
        ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (v) => <StatusBadge tone="brand" dot={false}>{String(v || '—').replace(/[_-]/g, ' ')}</StatusBadge>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (v) => <span className="font-semibold tabular-nums text-slate-900">{formatCurrency(v)}</span>,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Transactions"
        count={query.data?.data?.meta?.total}
        subtitle="All payments processed through the platform."
      />
      <Panel
        title="Payment history"
        bodyClassName="p-0"
        extra={
          <Segmented
            value={t.filters.sender}
            onChange={(v) => t.setFilter('sender', v)}
            options={FILTERS}
          />
        }
      >
        <DataTable
          columns={columns}
          dataSource={query.data?.data?.result ?? []}
          query={query}
          page={t.page}
          limit={t.limit}
          onPageChange={t.setPage}
          emptyTitle="No transactions yet"
          scrollX={900}
        />
      </Panel>
    </div>
  )
}

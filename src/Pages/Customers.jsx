import { useState } from 'react'
import { Popconfirm, Select, Switch } from 'antd'
import toast from 'react-hot-toast'
import { useGetAllCustomersQuery, useBlockUnblockCustomerMutation } from '../Redux/customerApis'
import { getErrorMessage } from '../Redux/baseApis'
import useTableQuery from '../hooks/useTableQuery'
import { fullName, rowNumber } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import SearchInput from '../components/ui/SearchInput'
import DataTable from '../components/ui/DataTable'
import EntityCell from '../components/ui/EntityCell'
import StatusBadge from '../components/ui/StatusBadge'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All customers' },
  { value: 'in-progress', label: 'Active' },
  { value: 'blocked', label: 'Blocked' },
]

export default function Customers() {
  const t = useTableQuery({ pageSize: 10, filters: { status: 'all' } })
  const query = useGetAllCustomersQuery({
    page: t.page,
    limit: t.limit,
    searchTerm: t.searchTerm,
    status: t.filters.status === 'all' ? undefined : t.filters.status,
  })
  const [blockUnblock] = useBlockUnblockCustomerMutation()
  const [pendingId, setPendingId] = useState(null)

  const setBlocked = async (customer, blocked) => {
    const userId = customer.user?._id
    if (!userId) return
    setPendingId(customer._id)
    try {
      await blockUnblock({ id: userId, status: blocked ? 'blocked' : 'in-progress' }).unwrap()
      toast.success(blocked ? 'Customer blocked' : 'Customer unblocked')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update customer'))
    } finally {
      setPendingId(null)
    }
  }

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 56,
      render: (_, __, i) => <span className="text-slate-400">{rowNumber(t.page, t.limit, i)}</span>,
    },
    {
      title: 'Customer',
      key: 'name',
      render: (_, c) => (
        <EntityCell
          image={c.profile_image}
          name={fullName(c.firstName, c.lastName) || 'Unnamed customer'}
          subtitle={c.email}
        />
      ),
    },
    { title: 'City', dataIndex: 'city', key: 'city', render: (v) => v || '—' },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (v) => <span className="capitalize">{v || '—'}</span>,
    },
    { title: 'Contact', dataIndex: 'phoneNumber', key: 'phone', render: (v) => v || '—' },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, c) =>
        c.user?.status === 'blocked' ? (
          <StatusBadge tone="danger">Blocked</StatusBadge>
        ) : (
          <StatusBadge tone="success">Active</StatusBadge>
        ),
    },
    {
      title: 'Access',
      key: 'access',
      width: 90,
      render: (_, c) => {
        const blocked = c.user?.status === 'blocked'
        return (
          <Popconfirm
            title={blocked ? 'Unblock this customer?' : 'Block this customer?'}
            description={
              blocked ? 'They will be able to sign in again.' : 'They will be signed out and cannot book.'
            }
            okText={blocked ? 'Unblock' : 'Block'}
            okButtonProps={{ danger: !blocked }}
            onConfirm={() => setBlocked(c, !blocked)}
          >
            <Switch size="small" checked={!blocked} loading={pendingId === c._id} aria-label="Toggle access" />
          </Popconfirm>
        )
      },
    },
  ]

  return (
    <div>
      <PageHeader
        title="Customers"
        count={query.data?.data?.meta?.total}
        subtitle="Everyone using the Carenes customer app."
      />
      <Panel
        title="All customers"
        bodyClassName="p-0"
        extra={
          <>
            <Select
              value={t.filters.status}
              onChange={(v) => t.setFilter('status', v)}
              options={STATUS_OPTIONS}
              className="w-40"
              aria-label="Filter by status"
            />
            <SearchInput value={t.search} onChange={t.setSearch} placeholder="Search name or email…" />
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
          emptyTitle="No customers found"
          scrollX={860}
        />
      </Panel>
    </div>
  )
}

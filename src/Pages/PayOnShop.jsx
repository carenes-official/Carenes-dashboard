import { useState } from 'react'
import { Button, Popconfirm } from 'antd'
import { HiOutlineBellAlert, HiOutlineMegaphone } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import {
  useGetAllShopDataQuery,
  useNotifyAllShopMutation,
  useNotifyOneShopMutation,
} from '../Redux/payOnShopApis'
import { getErrorMessage } from '../Redux/baseApis'
import useTableQuery from '../hooks/useTableQuery'
import { formatCurrency, rowNumber } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import SearchInput from '../components/ui/SearchInput'
import DataTable from '../components/ui/DataTable'
import EntityCell from '../components/ui/EntityCell'

export default function PayOnShop() {
  const t = useTableQuery({ pageSize: 10 })
  const query = useGetAllShopDataQuery({ page: t.page, limit: t.limit, searchTerm: t.searchTerm })
  const [notifyAll, { isLoading: notifyingAll }] = useNotifyAllShopMutation()
  const [notifyOne] = useNotifyOneShopMutation()
  const [pendingId, setPendingId] = useState(null)

  const handleNotifyAll = async () => {
    try {
      await notifyAll().unwrap()
      toast.success('Payment reminder sent to all shops with a balance')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not notify shops'))
    }
  }

  const handleNotifyOne = async (shop) => {
    setPendingId(shop._id)
    try {
      await notifyOne(shop._id).unwrap()
      toast.success(`Reminder sent to ${shop.shopName || 'shop'}`)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not notify this shop'))
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
      title: 'Shop',
      key: 'shop',
      render: (_, s) => (
        <EntityCell image={s.shopImages?.[0]} name={s.shopName || 'Unnamed shop'} subtitle={s.email} shape="square" />
      ),
    },
    {
      title: 'Amount due',
      dataIndex: 'payOnShopChargeDueAmount',
      key: 'due',
      align: 'right',
      render: (v) => (
        <span className={`font-semibold tabular-nums ${Number(v) > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
          {formatCurrency(v)}
        </span>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 130,
      align: 'right',
      render: (_, s) => (
        <Button
          size="small"
          icon={<HiOutlineBellAlert className="h-4 w-4" />}
          loading={pendingId === s._id}
          disabled={!(Number(s.payOnShopChargeDueAmount) > 0)}
          onClick={() => handleNotifyOne(s)}
        >
          Remind
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Pay on Shop"
        count={query.data?.data?.meta?.total}
        subtitle="Platform fees owed by salons for bookings paid in the shop."
        actions={
          <Popconfirm
            title="Send a payment reminder to all shops?"
            description="Every shop with an outstanding balance gets a notification."
            okText="Send reminders"
            onConfirm={handleNotifyAll}
          >
            <Button type="primary" icon={<HiOutlineMegaphone className="h-4 w-4" />} loading={notifyingAll}>
              Notify all shops
            </Button>
          </Popconfirm>
        }
      />
      <Panel
        title="Outstanding balances"
        bodyClassName="p-0"
        extra={<SearchInput value={t.search} onChange={t.setSearch} placeholder="Search shop…" />}
      >
        <DataTable
          columns={columns}
          dataSource={query.data?.data?.result ?? []}
          query={query}
          page={t.page}
          limit={t.limit}
          onPageChange={t.setPage}
          emptyTitle="No outstanding balances"
          scrollX={600}
        />
      </Panel>
    </div>
  )
}

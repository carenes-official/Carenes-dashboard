import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Switch, Tooltip } from 'antd'
import { HiOutlineStar, HiOutlineEye } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { useUpdateShopMutation } from '../../Redux/shopApis'
import { getErrorMessage } from '../../Redux/baseApis'
import { averageRating, rowNumber } from '../../lib/format'
import DataTable from '../ui/DataTable'
import EntityCell from '../ui/EntityCell'
import StatusBadge from '../ui/StatusBadge'

export default function ShopsTable({ query, page, limit, onPageChange, compact = false }) {
  const navigate = useNavigate()
  const [updateShop] = useUpdateShopMutation()
  const [pendingId, setPendingId] = useState(null)
  const shops = query.data?.data?.result ?? []

  const toggleStatus = async (shop, checked) => {
    const status = checked ? 'active' : 'inactive'
    setPendingId(shop._id)
    try {
      await updateShop({ id: shop._id, data: { status } }).unwrap()
      toast.success(`${shop.shopName || 'Shop'} is now ${status}`)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update shop status'))
    } finally {
      setPendingId(null)
    }
  }

  const open = (shop) => navigate(`/shop-details/${shop._id}`)

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 56,
      render: (_, __, i) => <span className="text-slate-400">{rowNumber(page, limit, i)}</span>,
    },
    {
      title: 'Shop',
      key: 'shop',
      render: (_, s) => (
        <EntityCell
          image={s.shopImages?.[0]}
          name={s.shopName || 'Unnamed shop'}
          subtitle={s.email}
          shape="square"
        />
      ),
    },
    { title: 'City', dataIndex: 'city', key: 'city', render: (v) => v || '—' },
    ...(compact
      ? []
      : [
          {
            title: 'Rating',
            key: 'rating',
            width: 100,
            render: (_, s) => {
              const r = averageRating(s.totalRating, s.totalRatingCount)
              return r ? (
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <HiOutlineStar className="h-4 w-4 text-amber-500" />
                  {r}
                  <span className="text-xs font-normal text-slate-400">({s.totalRatingCount})</span>
                </span>
              ) : (
                <span className="text-slate-400">No ratings</span>
              )
            },
          },
        ]),
    { title: 'Contact', dataIndex: 'phoneNumber', key: 'phone', render: (v) => v || '—' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <StatusBadge tone={status === 'active' ? 'success' : 'danger'}>{status || 'unknown'}</StatusBadge>
      ),
    },
    {
      title: 'Active',
      key: 'toggle',
      width: 90,
      render: (_, s) => (
        <span onClick={(e) => e.stopPropagation()}>
          <Switch
            size="small"
            checked={s.status === 'active'}
            loading={pendingId === s._id}
            onChange={(checked) => toggleStatus(s, checked)}
            aria-label={`Toggle ${s.shopName}`}
          />
        </span>
      ),
    },
    {
      title: '',
      key: 'view',
      width: 64,
      align: 'right',
      render: (_, s) => (
        <Tooltip title="View details">
          <Button
            type="text"
            icon={<HiOutlineEye className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation()
              open(s)
            }}
            aria-label="View details"
          />
        </Tooltip>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      dataSource={shops}
      query={query}
      page={page}
      limit={limit}
      onPageChange={onPageChange}
      emptyTitle="No shops found"
      emptyDescription="Try another search or filter."
      onRow={(record) => ({ onClick: () => open(record), className: 'cursor-pointer' })}
      scrollX={compact ? 720 : 900}
    />
  )
}

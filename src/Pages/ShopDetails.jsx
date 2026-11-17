import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Avatar, Popconfirm, Switch, Tabs } from 'antd'
import { HiOutlineStar, HiOutlineMapPin, HiOutlinePhone, HiOutlineEnvelope } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { useGetOneShopDetailsQuery, useUpdateShopMutation } from '../Redux/shopApis'
import { getErrorMessage } from '../Redux/baseApis'
import { averageRating, imageUrl, initials } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import StatusBadge from '../components/ui/StatusBadge'
import { ErrorState, LoadingBlock } from '../components/ui/QueryState'
import PersonalDetails from '../components/ShopDetails/PersonalDetails'
import AccountDetails from '../components/ShopDetails/AccountDetails'
import ShopServices from '../components/ShopDetails/ShopServices'
import ShopStaff from '../components/ShopDetails/ShopStaff'
import ShopPhoto from '../components/ShopDetails/ShopPhoto'

export default function ShopDetails() {
  const { id } = useParams()
  const query = useGetOneShopDetailsQuery({ id })
  const [updateShop, { isLoading: updating }] = useUpdateShopMutation()
  const [tab, setTab] = useState('overview')

  if (query.isLoading) return <LoadingBlock rows={10} />
  if (query.isError && !query.data) {
    return (
      <div className="surface">
        <ErrorState error={query.error} onRetry={query.refetch} title="Could not load this shop" />
      </div>
    )
  }

  const shop = query.data?.data || {}
  const active = shop.status === 'active'
  const rating = averageRating(shop.totalRating, shop.totalRatingCount)

  const toggle = async () => {
    const status = active ? 'inactive' : 'active'
    try {
      await updateShop({ id, data: { status } }).unwrap()
      toast.success(`Shop is now ${status}`)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update shop status'))
    }
  }

  return (
    <div>
      <PageHeader back title={shop.shopName || 'Shop details'} subtitle="Shops › Details" />

      <div className="surface mb-6 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-700 via-brand to-teal-500" />
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-10 flex items-end gap-4">
            <Avatar
              size={88}
              shape="square"
              src={imageUrl(shop.shopImages?.[0])}
              className="rounded-2xl border-4 border-white bg-brand-50 text-2xl font-semibold text-brand-700 shadow-card"
            >
              {initials(shop.shopName)}
            </Avatar>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{shop.shopName || 'Unnamed shop'}</h2>
                <StatusBadge tone={active ? 'success' : 'danger'}>{shop.status || 'unknown'}</StatusBadge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                {shop.city && (
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineMapPin className="h-4 w-4" /> {shop.city}
                  </span>
                )}
                {shop.phoneNumber && (
                  <span className="inline-flex items-center gap-1">
                    <HiOutlinePhone className="h-4 w-4" /> {shop.phoneNumber}
                  </span>
                )}
                {shop.email && (
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineEnvelope className="h-4 w-4" /> {shop.email}
                  </span>
                )}
                {rating && (
                  <span className="inline-flex items-center gap-1">
                    <HiOutlineStar className="h-4 w-4 text-amber-500" /> {rating} ({shop.totalRatingCount})
                  </span>
                )}
              </div>
            </div>
          </div>
          <Popconfirm
            title={active ? 'Deactivate this shop?' : 'Activate this shop?'}
            description={
              active ? 'It will be hidden from customers in the app.' : 'It will become visible to customers.'
            }
            okText={active ? 'Deactivate' : 'Activate'}
            okButtonProps={{ danger: active }}
            onConfirm={toggle}
          >
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-2.5">
              <span className="text-sm font-medium text-slate-700">Visible in app</span>
              <Switch checked={active} loading={updating} />
            </label>
          </Popconfirm>
        </div>
      </div>

      <Panel bodyClassName="px-4 pb-4 sm:px-6 sm:pb-6">
        <Tabs
          activeKey={tab}
          onChange={setTab}
          items={[
            { key: 'overview', label: 'Overview', children: <PersonalDetails shopData={shop} /> },
            { key: 'bank', label: 'Bank details', children: <AccountDetails shopData={shop} /> },
            { key: 'services', label: 'Services', children: <ShopServices shopId={id} /> },
            { key: 'staff', label: 'Staff & hours', children: <ShopStaff shopId={id} /> },
            {
              key: 'photos',
              label: `Photos${shop.shopImages?.length ? ` (${shop.shopImages.length})` : ''}`,
              children: <ShopPhoto shopImages={shop.shopImages} />,
            },
          ]}
        />
      </Panel>
    </div>
  )
}

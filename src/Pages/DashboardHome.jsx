import StatCards from '../components/DashboardHome/StatCards'
import SalesOverview from '../components/DashboardHome/SalesOverview'
import RecentCustomer from '../components/DashboardHome/RecentCustomer'
import ShopsRegistration from '../components/DashboardHome/ShopsRegistration'
import { useGetProfileInformationQuery } from '../Redux/profileApis'

const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardHome() {
  const { data } = useGetProfileInformationQuery()
  const firstName = data?.data?.name?.split(' ')[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
          {greeting()}
          {firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Here&apos;s what&apos;s happening across Carenes today.</p>
      </div>

      <StatCards />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <SalesOverview />
        <RecentCustomer />
      </div>

      <ShopsRegistration />
    </div>
  )
}

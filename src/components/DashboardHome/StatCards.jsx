import { Skeleton } from 'antd'
import {
  HiOutlineCurrencyEuro,
  HiOutlineChartBar,
  HiOutlineSparkles,
  HiOutlineBuildingStorefront,
  HiOutlineUsers,
  HiArrowTrendingUp,
  HiArrowTrendingDown,
} from 'react-icons/hi2'
import { useGetMetaDataQuery } from '../../Redux/metaApis'
import { formatCurrency, formatNumber } from '../../lib/format'
import { ErrorState } from '../ui/QueryState'

function Trend({ type, percentage }) {
  const value = Number(percentage)
  if (!Number.isFinite(value)) return null
  const down = type === 'decrease'
  const Icon = down ? HiArrowTrendingDown : HiArrowTrendingUp
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        down ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(value).toFixed(1)}%
    </span>
  )
}

export default function StatCards() {
  const { data, isLoading, isError, error, refetch } = useGetMetaDataQuery()
  const m = data?.data || {}

  if (isError && !data) {
    return (
      <div className="surface">
        <ErrorState error={error} onRetry={refetch} title="Could not load statistics" />
      </div>
    )
  }

  const cards = [
    {
      label: 'Total sales',
      value: formatCurrency(m.totalSales),
      hint: m.pendingSales ? `${formatCurrency(m.pendingSales)} pending` : 'Recognised revenue',
      icon: HiOutlineCurrencyEuro,
      trend: [m.totalSalesChangeType, m.totalSalesChangePercentage],
      accent: 'bg-brand-50 text-brand-700',
    },
    {
      label: 'Platform profit',
      value: formatCurrency(m.totalProfit),
      hint: 'Commission earned',
      icon: HiOutlineChartBar,
      trend: [m.totalProfitChangeType, m.totalProfitChangePercentage],
      accent: 'bg-violet-50 text-violet-700',
    },
    {
      label: 'Services',
      value: formatNumber(m.totalService),
      hint: 'Listed by salons',
      icon: HiOutlineSparkles,
      trend: [m.serviceChangeType, m.serviceChangePercentage],
      accent: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Salons',
      value: formatNumber(m.totalClient),
      hint: 'Registered shops',
      icon: HiOutlineBuildingStorefront,
      trend: [m.clientChangeType, m.clientChangePercentage],
      accent: 'bg-sky-50 text-sky-700',
    },
    {
      label: 'Customers',
      value: formatNumber(m.totalCustomer),
      hint: 'App users',
      icon: HiOutlineUsers,
      trend: [m.customerChangeType, m.customerChangePercentage],
      accent: 'bg-emerald-50 text-emerald-700',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(({ label, value, hint, icon: Icon, trend, accent }) => (
        <div key={label} className="surface p-5 transition-shadow hover:shadow-lift">
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 2 }} title={false} />
          ) : (
            <>
              <div className="flex items-start justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <Trend type={trend[0]} percentage={trend[1]} />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-1 truncate text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
              <p className="mt-1 text-xs text-slate-400">{hint} · vs last month</p>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

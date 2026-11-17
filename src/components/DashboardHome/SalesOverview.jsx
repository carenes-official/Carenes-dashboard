import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Select, Skeleton } from 'antd'
import { useGetSalesProfitChartDataQuery } from '../../Redux/metaApis'
import { formatCompactCurrency, formatCurrency } from '../../lib/format'
import Panel from '../ui/Panel'
import { ErrorState } from '../ui/QueryState'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip, Legend)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const FIRST_YEAR = 2023
const SALES = '#016A70'
const PROFIT = '#8B5CF6'

const gradient = (hex) => (ctx) => {
  const { chart } = ctx
  const { chartArea, ctx: canvas } = chart
  if (!chartArea) return 'transparent'
  const g = canvas.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
  g.addColorStop(0, `${hex}33`)
  g.addColorStop(1, `${hex}00`)
  return g
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, color: '#475569', font: { size: 12 } },
    },
    tooltip: {
      backgroundColor: '#0F172A',
      padding: 12,
      cornerRadius: 10,
      titleFont: { weight: '600' },
      callbacks: { label: (c) => ` ${c.dataset.label}: ${formatCurrency(c.parsed.y)}` },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      border: { display: false },
      grid: { color: '#EEF2F6' },
      ticks: { color: '#94A3B8', callback: (v) => formatCompactCurrency(v), maxTicksLimit: 6 },
    },
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: { color: '#94A3B8' },
    },
  },
  elements: { line: { tension: 0.35, borderWidth: 2.5 }, point: { radius: 0, hoverRadius: 5 } },
}

export default function SalesOverview() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const { data, isLoading, isFetching, isError, error, refetch } = useGetSalesProfitChartDataQuery(year)

  const yearOptions = useMemo(
    () =>
      Array.from({ length: currentYear - FIRST_YEAR + 1 }, (_, i) => {
        const y = currentYear - i
        return { value: y, label: String(y) }
      }),
    [currentYear]
  )

  const chartData = useMemo(() => {
    const months = data?.data?.data || []
    return {
      labels: MONTHS,
      datasets: [
        {
          label: 'Sales',
          data: MONTHS.map((_, i) => months[i]?.totalSales ?? 0),
          borderColor: SALES,
          backgroundColor: gradient(SALES),
          pointBackgroundColor: SALES,
          fill: true,
        },
        {
          label: 'Profit',
          data: MONTHS.map((_, i) => months[i]?.totalProfit ?? 0),
          borderColor: PROFIT,
          backgroundColor: gradient(PROFIT),
          pointBackgroundColor: PROFIT,
          fill: true,
        },
      ],
    }
  }, [data])

  return (
    <Panel
      title="Revenue overview"
      description={
        isLoading ? 'Loading…' : `${formatCurrency(data?.data?.totalSales)} total sales in ${year}`
      }
      extra={
        <Select
          value={year}
          onChange={setYear}
          options={yearOptions}
          className="w-28"
          loading={isFetching}
          aria-label="Select year"
        />
      }
    >
      {isError && !data ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <div className={`h-[320px] transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
          <Line data={chartData} options={options} />
        </div>
      )}
    </Panel>
  )
}

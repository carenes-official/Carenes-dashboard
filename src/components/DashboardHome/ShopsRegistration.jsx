import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowRight } from 'react-icons/hi2'
import { useGetAllShopQuery } from '../../Redux/shopApis'
import Panel from '../ui/Panel'
import ShopsTable from '../shops/ShopsTable'

const LIMIT = 5

export default function ShopsRegistration() {
  const [page, setPage] = useState(1)
  const query = useGetAllShopQuery({ page, limit: LIMIT })

  return (
    <Panel
      title="Latest shop registrations"
      description="Newest salons on the platform"
      extra={
        <Link to="/shops" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-700">
          All shops <HiArrowRight className="h-4 w-4" />
        </Link>
      }
      bodyClassName="p-0"
    >
      <ShopsTable query={query} page={page} limit={LIMIT} onPageChange={setPage} compact />
    </Panel>
  )
}

import { Button } from 'antd'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="surface flex flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-5xl font-bold tracking-tight text-brand">404</p>
      <p className="mt-3 text-lg font-semibold text-slate-900">Page not found</p>
      <p className="mt-1 text-sm text-slate-500">The page you are looking for doesn&apos;t exist.</p>
      <Link to="/" className="mt-6">
        <Button type="primary">Back to dashboard</Button>
      </Link>
    </div>
  )
}

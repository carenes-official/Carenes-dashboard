import { Button } from 'antd'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

// Catches render errors and failed lazy chunk loads (e.g. after a deploy).
export default function RouteError() {
  const error = useRouteError()
  const isChunkError = /dynamically imported module|Loading chunk|Importing a module script failed/i.test(
    error?.message || ''
  )

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : isChunkError
      ? 'A new version of the dashboard is available.'
      : 'Something went wrong while showing this page.'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7F9] p-6">
      <div className="surface max-w-md p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">{message}</p>
        <p className="mt-2 text-sm text-slate-500">
          Reload the page to continue. If the problem persists, contact support.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={() => window.location.assign('/')}>Go to dashboard</Button>
          <Button type="primary" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    </div>
  )
}

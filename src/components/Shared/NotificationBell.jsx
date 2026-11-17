import { useState } from 'react'
import { Badge, Button, Popover, Spin } from 'antd'
import { HiOutlineBell, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import {
  useGetAllNotificationsQuery,
  useReadAllNotificationsMutation,
} from '../../Redux/notificationApis'
import { getErrorMessage } from '../../Redux/baseApis'
import { formatRelativeTime } from '../../lib/format'

const PAGE_SIZE = 6

function NotificationList({ page, setPage, query, onMarkAll, marking }) {
  const { data, isLoading, isError, refetch } = query
  const items = data?.data?.result ?? []
  const totalPage = data?.data?.meta?.totalPage ?? 1
  const unread = data?.data?.meta?.unreadCount ?? 0

  return (
    <div className="w-[min(92vw,380px)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <p className="font-semibold text-slate-900">Notifications</p>
          <p className="text-xs text-slate-500">{unread} unread</p>
        </div>
        <Button type="link" size="small" onClick={onMarkAll} loading={marking} disabled={!unread}>
          Mark all as read
        </Button>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : isError ? (
          <div className="px-4 py-8 text-center text-sm text-slate-500">
            Could not load notifications.{' '}
            <button type="button" className="cursor-pointer bg-transparent text-brand" onClick={refetch}>
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-slate-500">You&apos;re all caught up.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((n) => (
              <li
                key={n._id}
                className={`flex gap-3 px-4 py-3 ${n.isRead ? '' : 'bg-brand-50/60'}`}
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.isRead ? 'bg-transparent' : 'bg-brand'}`}
                />
                <div className="min-w-0 flex-1">
                  {n.title && <p className="text-sm font-medium text-slate-900">{n.title}</p>}
                  <p className="text-sm text-slate-600">{n.message}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatRelativeTime(n.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPage > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
          <span>
            Page {page} of {totalPage}
          </span>
          <div className="flex gap-1">
            <Button
              size="small"
              icon={<HiChevronLeft />}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            />
            <Button
              size="small"
              icon={<HiChevronRight />}
              disabled={page >= totalPage}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  // Backend does not push admin notifications over the socket, so poll.
  const query = useGetAllNotificationsQuery(
    { page, limit: PAGE_SIZE },
    { pollingInterval: 60_000, refetchOnFocus: true, skipPollingIfUnfocused: true }
  )
  const [readAll, { isLoading: marking }] = useReadAllNotificationsMutation()
  const unread = query.data?.data?.meta?.unreadCount ?? 0

  const handleMarkAll = async () => {
    try {
      await readAll().unwrap()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not mark notifications as read'))
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomRight"
      arrow={false}
      styles={{ body: { padding: 0 } }}
      content={
        <NotificationList
          page={page}
          setPage={setPage}
          query={query}
          onMarkAll={handleMarkAll}
          marking={marking}
        />
      }
    >
      <button
        type="button"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <Badge count={unread} size="small" offset={[2, -2]} overflowCount={99}>
          <HiOutlineBell className="h-5 w-5 text-slate-600" />
        </Badge>
      </button>
    </Popover>
  )
}

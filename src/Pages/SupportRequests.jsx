import { useEffect, useState } from 'react'
import { Button, Drawer, Input, Popconfirm, Segmented, Select, Tooltip } from 'antd'
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2'
import toast from 'react-hot-toast'
import {
  useDeleteSupportTicketMutation,
  useGetSupportTicketsQuery,
  useUpdateSupportTicketMutation,
} from '../Redux/supportApis'
import { getErrorMessage } from '../Redux/baseApis'
import useTableQuery from '../hooks/useTableQuery'
import { formatDateTime, formatRelativeTime, rowNumber } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import SearchInput from '../components/ui/SearchInput'
import DataTable from '../components/ui/DataTable'
import EntityCell from '../components/ui/EntityCell'
import StatusBadge from '../components/ui/StatusBadge'

const TICKET_STATUS = {
  pending: { label: 'Pending', tone: 'warning' },
  processing: { label: 'Processing', tone: 'brand' },
  resolved: { label: 'Resolved', tone: 'success' },
}

const STATUS_OPTIONS = Object.entries(TICKET_STATUS).map(([value, { label }]) => ({ value, label }))

const USER_TYPE_LABEL = { customer: 'Customer', salon: 'Salon owner', other: 'Other' }

function StatusSelect({ ticket, size = 'middle', className = '', onUpdated }) {
  const [update, { isLoading }] = useUpdateSupportTicketMutation()

  const change = async (status) => {
    try {
      const res = await update({ id: ticket._id, status }).unwrap()
      onUpdated?.(res?.data)
      toast.success(`Marked as ${TICKET_STATUS[status].label.toLowerCase()}`)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update status'))
    }
  }

  return (
    <Select
      size={size}
      value={ticket.status}
      onChange={change}
      loading={isLoading}
      disabled={isLoading}
      className={className}
      popupMatchSelectWidth={false}
      onClick={(e) => e.stopPropagation()}
      options={STATUS_OPTIONS.map((o) => ({
        value: o.value,
        label: <StatusBadge tone={TICKET_STATUS[o.value].tone}>{o.label}</StatusBadge>,
      }))}
      aria-label="Change status"
    />
  )
}

function TicketDrawer({ ticket, onClose, onUpdated }) {
  const [note, setNote] = useState('')
  const [update, { isLoading: savingNote }] = useUpdateSupportTicketMutation()
  const [remove, { isLoading: deleting }] = useDeleteSupportTicketMutation()

  useEffect(() => {
    setNote(ticket?.adminNote || '')
  }, [ticket?._id, ticket?.adminNote])

  if (!ticket) return null

  const saveNote = async () => {
    try {
      const res = await update({ id: ticket._id, adminNote: note.trim() }).unwrap()
      onUpdated?.(res?.data)
      toast.success('Note saved')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save note'))
    }
  }

  const handleDelete = async () => {
    try {
      await remove(ticket._id).unwrap()
      toast.success('Support request deleted')
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete'))
    }
  }

  const replyHref = `mailto:${ticket.email}?subject=${encodeURIComponent(
    'Re: Your Carenes support request'
  )}`

  return (
    <Drawer
      open={Boolean(ticket)}
      onClose={onClose}
      width={520}
      title="Support request"
      destroyOnClose
      extra={<StatusSelect ticket={ticket} className="w-40" onUpdated={onUpdated} />}
      footer={
        <div className="flex items-center justify-between">
          <Popconfirm
            title="Delete this support request?"
            description="This cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={handleDelete}
          >
            <Button danger type="text" icon={<HiOutlineTrash className="h-4 w-4" />} loading={deleting}>
              Delete
            </Button>
          </Popconfirm>
          <a href={replyHref}>
            <Button type="primary" icon={<HiOutlineEnvelope className="h-4 w-4" />}>
              Reply by email
            </Button>
          </a>
        </div>
      }
    >
      <div className="space-y-6">
        <EntityCell name={ticket.name} subtitle={USER_TYPE_LABEL[ticket.userType] || 'Not specified'} size={44} />

        <dl className="grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 text-sm ring-1 ring-inset ring-slate-100">
          <div className="flex items-center gap-2">
            <HiOutlineEnvelope className="h-4 w-4 shrink-0 text-slate-400" />
            <a href={replyHref} className="truncate text-brand hover:underline">{ticket.email}</a>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlinePhone className="h-4 w-4 shrink-0 text-slate-400" />
            {ticket.phone ? (
              <a href={`tel:${ticket.phone.replace(/\s+/g, '')}`} className="text-slate-700 hover:underline">
                {ticket.phone}
              </a>
            ) : (
              <span className="text-slate-400">No phone number</span>
            )}
          </div>
          <div className="text-xs text-slate-500">
            Received {formatDateTime(ticket.createdAt)}
            {ticket.resolvedAt && <> · Resolved {formatDateTime(ticket.resolvedAt)}</>}
          </div>
        </dl>

        {ticket.emailDelivered === false && (
          <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 ring-1 ring-inset ring-amber-200">
            <HiOutlineExclamationTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            The email copy to the support inbox could not be sent. This request is only visible here.
          </p>
        )}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Message</p>
          <div className="whitespace-pre-wrap break-words rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-slate-800">
            {ticket.message}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Internal note <span className="font-normal normal-case text-slate-400">(only admins see this)</span>
          </p>
          <Input.TextArea
            rows={4}
            maxLength={2000}
            showCount
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Called the customer, refund issued on 18 Nov."
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={saveNote} loading={savingNote} disabled={note.trim() === (ticket.adminNote || '')}>
              Save note
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default function SupportRequests() {
  const t = useTableQuery({ pageSize: 10, filters: { status: 'pending' } })
  const query = useGetSupportTicketsQuery(
    {
      page: t.page,
      limit: t.limit,
      searchTerm: t.searchTerm,
      status: t.filters.status === 'all' ? undefined : t.filters.status,
    },
    { pollingInterval: 60_000, refetchOnFocus: true, skipPollingIfUnfocused: true }
  )
  const [opened, setOpened] = useState(null)

  const tickets = query.data?.data?.result ?? []
  const counts = query.data?.data?.meta?.statusCounts || {}
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  // Prefer the latest list data; fall back to the snapshot when a status
  // change moved the ticket out of the current filter.
  const openTicket = opened ? tickets.find((x) => x._id === opened._id) || opened : null

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 56,
      render: (_, __, i) => <span className="text-slate-400">{rowNumber(t.page, t.limit, i)}</span>,
    },
    {
      title: 'From',
      key: 'from',
      width: 240,
      render: (_, x) => <EntityCell name={x.name} subtitle={x.email} />,
    },
    {
      title: 'Type',
      dataIndex: 'userType',
      key: 'type',
      width: 120,
      render: (v) => <span className="text-slate-600">{USER_TYPE_LABEL[v] || '—'}</span>,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      render: (v) => <p className="line-clamp-2 max-w-md text-slate-600">{v}</p>,
    },
    {
      title: 'Received',
      dataIndex: 'createdAt',
      key: 'date',
      width: 130,
      render: (v) => (
        <Tooltip title={formatDateTime(v)}>
          <span className="whitespace-nowrap text-slate-500">{formatRelativeTime(v)}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 170,
      render: (_, x) => <StatusSelect ticket={x} size="small" className="w-36" />,
    },
    {
      title: '',
      key: 'view',
      width: 56,
      align: 'right',
      render: (_, x) => (
        <Tooltip title="Open">
          <Button
            type="text"
            icon={<HiOutlineEye className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation()
              setOpened(x)
            }}
            aria-label="Open request"
          />
        </Tooltip>
      ),
    },
  ]

  const tab = (value, label) => ({
    value,
    label: (
      <span className="flex items-center gap-1.5 px-1">
        {label}
        <span className="rounded-full bg-slate-200/70 px-1.5 text-xs font-semibold text-slate-600">
          {value === 'all' ? total : counts[value] ?? 0}
        </span>
      </span>
    ),
  })

  return (
    <div>
      <PageHeader
        title="Support requests"
        subtitle="Messages sent through the public support page. Each one is also emailed to the support inbox."
      />
      <Panel
        bodyClassName="p-0"
        title={
          <Segmented
            value={t.filters.status}
            onChange={(v) => t.setFilter('status', v)}
            options={[
              tab('pending', 'Pending'),
              tab('processing', 'Processing'),
              tab('resolved', 'Resolved'),
              tab('all', 'All'),
            ]}
          />
        }
        extra={<SearchInput value={t.search} onChange={t.setSearch} placeholder="Search name, email, message…" />}
      >
        <DataTable
          columns={columns}
          dataSource={tickets}
          query={query}
          page={t.page}
          limit={t.limit}
          onPageChange={t.setPage}
          emptyTitle={t.filters.status === 'pending' ? 'No pending requests' : 'No support requests'}
          emptyDescription={t.filters.status === 'pending' ? 'You are all caught up.' : undefined}
          onRow={(record) => ({ onClick: () => setOpened(record), className: 'cursor-pointer' })}
          scrollX={980}
        />
      </Panel>
      <TicketDrawer
        ticket={openTicket}
        onClose={() => setOpened(null)}
        onUpdated={(t2) => t2 && setOpened(t2)}
      />
    </div>
  )
}

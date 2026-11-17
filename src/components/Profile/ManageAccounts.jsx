import { useState } from 'react'
import { Button, Form, Input, Modal, Popconfirm, Switch, Tooltip } from 'antd'
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import {
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useGetAllAdminInformationQuery,
  useUpdateAdminStatusMutation,
} from '../../Redux/manageAccountsApis'
import { getErrorMessage } from '../../Redux/baseApis'
import { rowNumber } from '../../lib/format'
import DataTable from '../ui/DataTable'
import EntityCell from '../ui/EntityCell'
import StatusBadge from '../ui/StatusBadge'

const LIMIT = 8

function AddAdminModal({ open, onClose }) {
  const [form] = Form.useForm()
  const [createAdmin, { isLoading }] = useCreateAdminMutation()

  const submit = async (values) => {
    try {
      await createAdmin({
        password: values.password,
        admin: { name: values.name.trim(), email: values.email.trim().toLowerCase() },
      }).unwrap()
      toast.success('Admin account created')
      form.resetFields()
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not create admin'))
    }
  }

  return (
    <Modal
      open={open}
      title="Add admin account"
      okText="Create account"
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={isLoading}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={submit} requiredMark={false} className="pt-2" preserve={false}>
        <Form.Item name="name" label="Full name" rules={[{ required: true, whitespace: true }]}>
          <Input autoFocus />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter an email' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Temporary password"
          extra="Share it securely; the admin should change it after the first login."
          rules={[
            { required: true, message: 'Please enter a password' },
            { min: 8, message: 'Use at least 8 characters' },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default function ManageAccounts() {
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingId, setPendingId] = useState(null)
  const query = useGetAllAdminInformationQuery({ page, limit: LIMIT })
  const [updateStatus] = useUpdateAdminStatusMutation()
  const [deleteAdmin] = useDeleteAdminMutation()

  const toggle = async (admin, checked) => {
    setPendingId(admin._id)
    try {
      await updateStatus({ id: admin._id, data: { status: checked ? 'active' : 'inactive' } }).unwrap()
      toast.success(checked ? 'Access granted' : 'Access revoked')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update access'))
    } finally {
      setPendingId(null)
    }
  }

  const remove = async (admin) => {
    try {
      await deleteAdmin(admin._id).unwrap()
      toast.success('Admin account deleted')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete admin'))
    }
  }

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 56,
      render: (_, __, i) => <span className="text-slate-400">{rowNumber(page, LIMIT, i)}</span>,
    },
    {
      title: 'Admin',
      key: 'name',
      render: (_, a) => <EntityCell image={a.profile_image} name={a.name} subtitle={a.email} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (s) => <StatusBadge tone={s === 'active' ? 'success' : 'neutral'}>{s || 'unknown'}</StatusBadge>,
    },
    {
      title: 'Access',
      key: 'access',
      width: 90,
      render: (_, a) => (
        <Switch
          size="small"
          checked={a.status === 'active'}
          loading={pendingId === a._id}
          onChange={(c) => toggle(a, c)}
          aria-label="Toggle access"
        />
      ),
    },
    {
      title: '',
      key: 'delete',
      width: 64,
      align: 'right',
      render: (_, a) => (
        <Popconfirm
          title="Delete this admin?"
          description="They will lose access to the dashboard immediately."
          okText="Delete"
          okButtonProps={{ danger: true }}
          onConfirm={() => remove(a)}
        >
          <Tooltip title="Delete">
            <Button type="text" danger icon={<HiOutlineTrash className="h-4 w-4" />} aria-label="Delete admin" />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">People who can sign in to this dashboard.</p>
        <Button type="primary" icon={<HiOutlinePlus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
          Add admin
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl ring-1 ring-inset ring-slate-100">
        <DataTable
          columns={columns}
          dataSource={query.data?.data?.result ?? []}
          query={query}
          page={page}
          limit={LIMIT}
          onPageChange={setPage}
          emptyTitle="No other admins yet"
          scrollX={560}
        />
      </div>
      <AddAdminModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

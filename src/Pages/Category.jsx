import { useEffect, useState } from 'react'
import { Button, Form, Image, Input, Modal, Popconfirm, Switch, Tooltip, Upload } from 'antd'
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlinePhoto } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetMyCategoriesQuery,
  useUpdateCategoryMutation,
} from '../Redux/categoryApis'
import { getErrorMessage } from '../Redux/baseApis'
import { imageUrl, rowNumber } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'
import DataTable from '../components/ui/DataTable'
import StatusBadge from '../components/ui/StatusBadge'

const LIMIT = 10
const MAX_IMAGE_MB = 5

function CategoryModal({ open, category, onClose }) {
  const [form] = Form.useForm()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation()
  const isEdit = Boolean(category)

  useEffect(() => {
    if (!open) return
    form.setFieldsValue({ categoryName: category?.categoryName || '' })
    setFile(null)
    setPreview(imageUrl(category?.image) || null)
  }, [open, category, form])

  // Release object URLs created for local previews.
  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const beforeUpload = (f) => {
    if (!f.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return Upload.LIST_IGNORE
    }
    if (f.size / 1024 / 1024 > MAX_IMAGE_MB) {
      toast.error(`Image must be smaller than ${MAX_IMAGE_MB} MB`)
      return Upload.LIST_IGNORE
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    return false
  }

  const submit = async ({ categoryName }) => {
    const formData = new FormData()
    formData.append('categoryName', categoryName.trim())
    if (file) formData.append('shop_category_image', file)
    try {
      if (isEdit) {
        await updateCategory({ id: category._id, data: formData }).unwrap()
        toast.success('Category updated')
      } else {
        await createCategory(formData).unwrap()
        toast.success('Category created')
      }
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save category'))
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? 'Edit category' : 'New category'}
      onCancel={onClose}
      okText={isEdit ? 'Save changes' : 'Create category'}
      onOk={() => form.submit()}
      confirmLoading={creating || updating}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={submit} requiredMark={false} className="pt-2">
        <Form.Item
          name="categoryName"
          label="Category name"
          rules={[
            { required: true, whitespace: true, message: 'Please enter a category name' },
            { max: 60, message: 'Keep it under 60 characters' },
          ]}
        >
          <Input placeholder="e.g. Hair, Nails, Massage" autoFocus />
        </Form.Item>
        <Form.Item label="Image" extra={`PNG or JPG, up to ${MAX_IMAGE_MB} MB.`}>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-inset ring-slate-200">
              {preview ? (
                <img src={preview} alt="" className="h-full w-full object-cover" />
              ) : (
                <HiOutlinePhoto className="h-7 w-7 text-slate-300" />
              )}
            </div>
            <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload} maxCount={1}>
              <Button>{preview ? 'Replace image' : 'Upload image'}</Button>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default function Category() {
  const [page, setPage] = useState(1)
  const query = useGetMyCategoriesQuery({ page, limit: LIMIT })
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [modal, setModal] = useState({ open: false, category: null })
  const [pendingId, setPendingId] = useState(null)

  const toggleStatus = async (c, visible) => {
    setPendingId(c._id)
    try {
      await updateCategory({ id: c._id, data: { status: visible ? 'active' : 'inactive' } }).unwrap()
      toast.success(visible ? 'Category is visible in the app' : 'Category hidden from the app')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update category'))
    } finally {
      setPendingId(null)
    }
  }

  const remove = async (c) => {
    try {
      await deleteCategory(c._id).unwrap()
      toast.success('Category deleted')
      if (query.data?.data?.result?.length === 1 && page > 1) setPage(page - 1)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete category'))
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
      title: 'Category',
      key: 'name',
      render: (_, c) => (
        <div className="flex items-center gap-3">
          {c.image ? (
            <Image
              src={imageUrl(c.image)}
              width={44}
              height={44}
              className="rounded-lg object-cover"
              alt={c.categoryName}
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-inset ring-slate-200">
              <HiOutlinePhoto className="h-5 w-5 text-slate-300" />
            </span>
          )}
          <span className="font-medium text-slate-900">{c.categoryName}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (s) => (
        <StatusBadge tone={s === 'active' ? 'success' : 'neutral'}>{s === 'active' ? 'Visible' : 'Hidden'}</StatusBadge>
      ),
    },
    {
      title: 'Visible',
      key: 'toggle',
      width: 90,
      render: (_, c) => (
        <Switch
          size="small"
          checked={c.status === 'active'}
          loading={pendingId === c._id}
          onChange={(v) => toggleStatus(c, v)}
          aria-label="Toggle visibility"
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 110,
      align: 'right',
      render: (_, c) => (
        <div className="flex justify-end gap-1">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<HiOutlinePencilSquare className="h-4 w-4" />}
              onClick={() => setModal({ open: true, category: c })}
              aria-label="Edit category"
            />
          </Tooltip>
          <Popconfirm
            title="Delete this category?"
            description="Shops using it will no longer be listed under it."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => remove(c)}
          >
            <Tooltip title="Delete">
              <Button type="text" danger icon={<HiOutlineTrash className="h-4 w-4" />} aria-label="Delete category" />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Categories"
        count={query.data?.data?.meta?.total}
        subtitle="Shop categories customers browse in the app."
        actions={
          <Button
            type="primary"
            icon={<HiOutlinePlus className="h-4 w-4" />}
            onClick={() => setModal({ open: true, category: null })}
          >
            New category
          </Button>
        }
      />
      <Panel bodyClassName="p-0">
        <DataTable
          columns={columns}
          dataSource={query.data?.data?.result ?? []}
          query={query}
          page={page}
          limit={LIMIT}
          onPageChange={setPage}
          emptyTitle="No categories yet"
          emptyDescription="Create the first category to get started."
          scrollX={600}
        />
      </Panel>
      <CategoryModal
        open={modal.open}
        category={modal.category}
        onClose={() => setModal({ open: false, category: null })}
      />
    </div>
  )
}

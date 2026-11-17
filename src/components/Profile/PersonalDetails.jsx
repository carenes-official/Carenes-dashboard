import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Button, Form, Input, Skeleton, Upload } from 'antd'
import { HiOutlineCamera, HiOutlineKey } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import {
  useGetProfileInformationQuery,
  useUpdateProfileInformationMutation,
  useUpdateSuperAdminProfileInformationMutation,
} from '../../Redux/profileApis'
import { getErrorMessage } from '../../Redux/baseApis'
import { imageUrl, initials } from '../../lib/format'
import { ErrorState } from '../ui/QueryState'

const MAX_IMAGE_MB = 5

export default function PersonalDetails({ role }) {
  const isSuperAdmin = role === 'superAdmin'
  const { data, isLoading, isError, error, refetch } = useGetProfileInformationQuery()
  const [updateAdmin, { isLoading: savingAdmin }] = useUpdateProfileInformationMutation()
  const [updateSuper, { isLoading: savingSuper }] = useUpdateSuperAdminProfileInformationMutation()
  const [form] = Form.useForm()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const profile = data?.data

  useEffect(() => {
    if (!profile) return
    form.setFieldsValue({
      name: profile.name || '',
      email: profile.email || '',
      phoneNumber: profile.phoneNumber || '',
    })
  }, [profile, form])

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview)
    },
    [preview]
  )

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

  const reset = () => {
    form.resetFields()
    form.setFieldsValue({ name: profile?.name, email: profile?.email, phoneNumber: profile?.phoneNumber })
    setFile(null)
    setPreview(null)
  }

  const onFinish = async (values) => {
    const formData = new FormData()
    formData.append('name', values.name.trim())
    if (!isSuperAdmin && values.phoneNumber) formData.append('phoneNumber', values.phoneNumber.trim())
    if (file) formData.append('profile_image', file)
    try {
      const res = isSuperAdmin
        ? await updateSuper(formData).unwrap()
        : await updateAdmin(formData).unwrap()
      toast.success(res?.message || 'Profile updated')
      setFile(null)
      setPreview(null)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update profile'))
    }
  }

  if (isLoading) return <Skeleton active avatar paragraph={{ rows: 6 }} />
  if (isError && !data) return <ErrorState error={error} onRetry={refetch} />

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar
              size={80}
              src={preview || imageUrl(profile?.profile_image)}
              className="bg-brand-50 text-2xl font-semibold text-brand-700 ring-4 ring-slate-100"
            >
              {initials(profile?.name)}
            </Avatar>
            <Upload accept="image/*" showUploadList={false} beforeUpload={beforeUpload} maxCount={1}>
              <button
                type="button"
                aria-label="Change photo"
                className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-card hover:bg-brand-600"
              >
                <HiOutlineCamera className="h-4 w-4" />
              </button>
            </Upload>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{profile?.name || '—'}</p>
            <p className="text-sm text-slate-500">{profile?.email}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand">
              {isSuperAdmin ? 'Super admin' : 'Admin'}
            </p>
          </div>
        </div>
        <Link to="/change-password">
          <Button icon={<HiOutlineKey className="h-4 w-4" />}>Change password</Button>
        </Link>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <Form.Item
            label="Full name"
            name="name"
            rules={[{ required: true, whitespace: true, message: 'Please enter your name' }]}
          >
            <Input autoComplete="name" />
          </Form.Item>
          <Form.Item label="Email" name="email" extra="Email can't be changed.">
            <Input disabled />
          </Form.Item>
          {!isSuperAdmin && (
            <Form.Item
              label="Phone number"
              name="phoneNumber"
              rules={[{ pattern: /^\+?[\d\s-]{6,20}$/, message: 'Enter a valid phone number' }]}
            >
              <Input autoComplete="tel" placeholder="+49 …" />
            </Form.Item>
          )}
        </div>
        <div className="mt-2 flex justify-end gap-2 border-t border-slate-100 pt-5">
          <Button onClick={reset}>Reset</Button>
          <Button type="primary" htmlType="submit" loading={savingAdmin || savingSuper}>
            Save changes
          </Button>
        </div>
      </Form>
    </div>
  )
}

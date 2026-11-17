import { useEffect } from 'react'
import { Button, Form, Input, Skeleton } from 'antd'
import toast from 'react-hot-toast'
import {
  useGetProfileInformationQuery,
  useUpdateProfileInformationMutation,
} from '../../Redux/profileApis'
import { getErrorMessage } from '../../Redux/baseApis'
import { ErrorState } from '../ui/QueryState'

const digits = [{ pattern: /^\d+$/, message: 'Numbers only' }]

export default function AccountDetails() {
  const { data, isLoading, isError, error, refetch } = useGetProfileInformationQuery()
  const [updateProfile, { isLoading: saving }] = useUpdateProfileInformationMutation()
  const [form] = Form.useForm()
  const profile = data?.data

  const fill = () =>
    form.setFieldsValue({
      bankName: profile?.bankName || '',
      accountName: profile?.accountName || '',
      accountNumber: profile?.accountNumber ? String(profile.accountNumber) : '',
      branchCode: profile?.branchCode ? String(profile.branchCode) : '',
    })

  useEffect(() => {
    if (profile) fill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const onFinish = async (values) => {
    try {
      const res = await updateProfile({
        bankName: values.bankName.trim(),
        accountName: values.accountName.trim(),
        accountNumber: Number(values.accountNumber),
        branchCode: Number(values.branchCode),
      }).unwrap()
      toast.success(res?.message || 'Bank details updated')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update bank details'))
    }
  }

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />
  if (isError && !data) return <ErrorState error={error} onRetry={refetch} />

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} className="max-w-2xl">
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Form.Item label="Bank name" name="bankName" rules={[{ required: true, whitespace: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Account holder" name="accountName" rules={[{ required: true, whitespace: true }]}>
          <Input autoComplete="name" />
        </Form.Item>
        <Form.Item label="Account number" name="accountNumber" rules={[{ required: true }, ...digits]}>
          <Input inputMode="numeric" />
        </Form.Item>
        <Form.Item label="Branch code" name="branchCode" rules={[{ required: true }, ...digits]}>
          <Input inputMode="numeric" />
        </Form.Item>
      </div>
      <div className="mt-2 flex justify-end gap-2 border-t border-slate-100 pt-5">
        <Button onClick={fill}>Reset</Button>
        <Button type="primary" htmlType="submit" loading={saving}>
          Save bank details
        </Button>
      </div>
    </Form>
  )
}

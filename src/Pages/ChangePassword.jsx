import { Button, Form, Input } from 'antd'
import { HiOutlineLockClosed } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useChangePasswordMutation } from '../Redux/authApis'
import { getErrorMessage } from '../Redux/baseApis'
import PageHeader from '../components/ui/PageHeader'
import Panel from '../components/ui/Panel'

export default function ChangePassword() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const onFinish = async ({ currentPassword, newPassword, confirmPassword }) => {
    try {
      const res = await changePassword({
        oldPassword: currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      }).unwrap()
      toast.success(res?.message || 'Password changed')
      form.resetFields()
      navigate('/profile')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not change password'))
    }
  }

  return (
    <div>
      <PageHeader back title="Change password" subtitle="Use a strong password you don't use anywhere else." />
      <Panel className="max-w-xl">
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label="Current password"
            name="currentPassword"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password prefix={<HiOutlineLockClosed className="text-slate-400" />} autoComplete="current-password" />
          </Form.Item>
          <Form.Item
            label="New password"
            name="newPassword"
            dependencies={['currentPassword']}
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 8, message: 'Use at least 8 characters' },
              ({ getFieldValue }) => ({
                validator: (_, v) =>
                  !v || v !== getFieldValue('currentPassword')
                    ? Promise.resolve()
                    : Promise.reject(new Error('New password must be different')),
              }),
            ]}
          >
            <Input.Password prefix={<HiOutlineLockClosed className="text-slate-400" />} autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="Confirm new password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm the new password' },
              ({ getFieldValue }) => ({
                validator: (_, v) =>
                  !v || v === getFieldValue('newPassword')
                    ? Promise.resolve()
                    : Promise.reject(new Error('Passwords do not match')),
              }),
            ]}
          >
            <Input.Password prefix={<HiOutlineLockClosed className="text-slate-400" />} autoComplete="new-password" />
          </Form.Item>
          <div className="mt-2 flex justify-end gap-2 border-t border-slate-100 pt-5">
            <Button onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Update password
            </Button>
          </div>
        </Form>
      </Panel>
    </div>
  )
}

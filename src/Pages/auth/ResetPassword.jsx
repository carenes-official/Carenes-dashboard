import { Button, Form, Input } from 'antd'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { HiOutlineLockClosed } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { useResetPasswordMutation } from '../../Redux/authApis'
import { getErrorMessage } from '../../Redux/baseApis'
import { resetEmail, setSession } from '../../lib/auth'
import AuthLayout from '../../Layout/AuthLayout'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [reset, { isLoading }] = useResetPasswordMutation()
  const email = resetEmail.get()

  if (!email) return <Navigate to="/forget-password" replace />

  const onFinish = async ({ password, confirmPassword }) => {
    try {
      const res = await reset({ email, password, confirmPassword }).unwrap()
      resetEmail.clear()
      toast.success(res?.message || 'Password updated')
      const token = res?.data?.accessToken
      if (token) {
        setSession(token)
        navigate('/', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not reset password'))
    }
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle={`For ${email}. Use at least 8 characters.`}
      footer={
        <Link to="/login" className="font-medium text-brand">
          Back to sign in
        </Link>
      }
    >
      <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
        <Form.Item
          label="New password"
          name="password"
          rules={[
            { required: true, message: 'Please enter a new password' },
            { min: 8, message: 'Use at least 8 characters' },
          ]}
        >
          <Input.Password prefix={<HiOutlineLockClosed className="text-slate-400" />} autoComplete="new-password" autoFocus />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator: (_, v) =>
                !v || v === getFieldValue('password')
                  ? Promise.resolve()
                  : Promise.reject(new Error('Passwords do not match')),
            }),
          ]}
        >
          <Input.Password prefix={<HiOutlineLockClosed className="text-slate-400" />} autoComplete="new-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={isLoading}>
          Update password
        </Button>
      </Form>
    </AuthLayout>
  )
}

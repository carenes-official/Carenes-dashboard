import { Button, Form, Input } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { useLoginMutation } from '../../Redux/authApis'
import { getErrorMessage } from '../../Redux/baseApis'
import { clearSession, decodeToken, setSession } from '../../lib/auth'
import AuthLayout from '../../Layout/AuthLayout'

const ADMIN_ROLES = ['admin', 'superAdmin']

export default function Login() {
  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()
  const location = useLocation()

  const onFinish = async ({ email, password }) => {
    try {
      const res = await login({ email: email.trim().toLowerCase(), password }).unwrap()
      const token = res?.data?.accessToken
      if (!token) throw new Error('No access token returned')

      // Customer and salon accounts must not get into the admin dashboard.
      if (!ADMIN_ROLES.includes(decodeToken(token)?.role)) {
        clearSession()
        toast.error('This account does not have admin access.')
        return
      }

      setSession(token)
      toast.success('Welcome back!')
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, err?.message || 'Login failed'))
    }
  }

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back. Sign in to the Carenes admin dashboard.">
      <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input
            prefix={<HiOutlineEnvelope className="text-slate-400" />}
            placeholder="you@carenes.de"
            autoComplete="email"
            autoFocus
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password
            prefix={<HiOutlineLockClosed className="text-slate-400" />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Form.Item>
        <div className="-mt-2 mb-6 text-right">
          <Link to="/forget-password" className="text-sm font-medium text-brand hover:text-brand-700">
            Forgot password?
          </Link>
        </div>
        <Button type="primary" htmlType="submit" block loading={isLoading}>
          Sign in
        </Button>
      </Form>
    </AuthLayout>
  )
}

import { useEffect, useState } from 'react'
import { Button, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineEnvelope, HiArrowLeft } from 'react-icons/hi2'
import toast from 'react-hot-toast'
import {
  useForgetPasswordMutation,
  useResendResetCodeMutation,
  useVerifyResetOtpMutation,
} from '../../Redux/authApis'
import { getErrorMessage } from '../../Redux/baseApis'
import { resetEmail } from '../../lib/auth'
import AuthLayout from '../../Layout/AuthLayout'

const OTP_LENGTH = 4
const RESEND_SECONDS = 60

export default function ForgetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(null)
  const [otp, setOtp] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [requestCode, { isLoading: sending }] = useForgetPasswordMutation()
  const [resendCode, { isLoading: resending }] = useResendResetCodeMutation()
  const [verify, { isLoading: verifying }] = useVerifyResetOtpMutation()

  useEffect(() => {
    if (cooldown <= 0) return undefined
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const sendCode = async ({ email: value }) => {
    const normalized = value.trim().toLowerCase()
    try {
      const res = await requestCode({ email: normalized }).unwrap()
      resetEmail.set(normalized)
      setEmail(normalized)
      setCooldown(RESEND_SECONDS)
      toast.success(res?.message || 'Verification code sent')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not send the code'))
    }
  }

  const resend = async () => {
    try {
      await resendCode({ email }).unwrap()
      setCooldown(RESEND_SECONDS)
      toast.success('A new code is on its way')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not resend the code'))
    }
  }

  const verifyCode = async () => {
    if (otp.length !== OTP_LENGTH) {
      toast.error(`Enter the ${OTP_LENGTH}-digit code`)
      return
    }
    try {
      const res = await verify({ email, resetCode: Number(otp) }).unwrap()
      toast.success(res?.message || 'Code verified')
      navigate('/reset-password')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Invalid or expired code'))
    }
  }

  if (!email) {
    return (
      <AuthLayout
        title="Forgot password?"
        subtitle="Enter your admin email and we'll send you a verification code."
        footer={
          <Link to="/login" className="inline-flex items-center gap-1 font-medium text-brand">
            <HiArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        }
      >
        <Form layout="vertical" onFinish={sendCode} requiredMark={false} size="large">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input prefix={<HiOutlineEnvelope className="text-slate-400" />} autoComplete="email" autoFocus />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={sending}>
            Send code
          </Button>
        </Form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Check your email"
      subtitle={`We sent a ${OTP_LENGTH}-digit code to ${email}.`}
      footer={
        <button
          type="button"
          onClick={() => {
            setEmail(null)
            setOtp('')
          }}
          className="inline-flex cursor-pointer items-center gap-1 bg-transparent font-medium text-brand"
        >
          <HiArrowLeft className="h-4 w-4" /> Use a different email
        </button>
      }
    >
      <div className="flex justify-center">
        <Input.OTP length={OTP_LENGTH} size="large" value={otp} onChange={setOtp} autoFocus />
      </div>
      <Button type="primary" block size="large" className="mt-6" loading={verifying} onClick={verifyCode}>
        Verify code
      </Button>
      <p className="mt-4 text-center text-sm text-slate-500">
        Didn&apos;t get it?{' '}
        <Button type="link" className="p-0" disabled={cooldown > 0} loading={resending} onClick={resend}>
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </Button>
      </p>
    </AuthLayout>
  )
}

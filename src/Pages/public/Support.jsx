import { useEffect, useState } from 'react'
import { Button, Form, Input, Segmented } from 'antd'
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2'
import toast from 'react-hot-toast'
import { useContactSupportMutation } from '../../Redux/supportApis'
import { getErrorMessage } from '../../Redux/baseApis'

const MAX_MESSAGE = 5000

const USER_TYPES = [
  { value: 'customer', label: 'Customer' },
  { value: 'salon', label: 'Salon owner' },
  { value: 'other', label: 'Other' },
]

function SuccessCard({ name, onReset }) {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <HiOutlineCheckCircle className="h-8 w-8" />
      </span>
      <h2 className="mt-4 text-xl font-semibold text-slate-900">Thanks{name ? `, ${name}` : ''}!</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        Your message has been sent to our support team. We usually reply within 1–2 business days to
        the email address you provided.
      </p>
      <Button className="mt-6" onClick={onReset}>
        Send another message
      </Button>
    </div>
  )
}

export default function Support() {
  const [form] = Form.useForm()
  const [sent, setSent] = useState(null)
  const [contact, { isLoading }] = useContactSupportMutation()
  const message = Form.useWatch('message', form) || ''

  useEffect(() => {
    document.title = 'Support · Carenes'
  }, [])

  const onFinish = async (values) => {
    try {
      await contact({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || undefined,
        userType: values.userType,
        message: values.message.trim(),
        website: values.website || undefined,
      }).unwrap()
      setSent(values.name.trim().split(' ')[0])
      form.resetFields()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not send your message. Please try again.'))
    }
  }

  return (
    <div>
      <header className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Support</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">How can we help?</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
          Questions about a booking, your salon account or the app? Send us a message and our team will get
          back to you by email.
        </p>
      </header>

      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <section className="surface p-5 sm:p-8">
          {sent !== null ? (
            <SuccessCard name={sent} onReset={() => setSent(null)} />
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              size="large"
              initialValues={{ userType: 'customer' }}
            >
              <Form.Item label="I am a" name="userType">
                <Segmented block options={USER_TYPES} />
              </Form.Item>

              <div className="grid gap-x-4 sm:grid-cols-2">
                <Form.Item
                  label="Full name"
                  name="name"
                  rules={[
                    { required: true, whitespace: true, message: 'Please enter your name' },
                    { min: 2, message: 'Name is too short' },
                    { max: 100, message: 'Name is too long' },
                  ]}
                >
                  <Input prefix={<HiOutlineUser className="text-slate-400" />} autoComplete="name" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Enter a valid email address' },
                  ]}
                >
                  <Input
                    prefix={<HiOutlineEnvelope className="text-slate-400" />}
                    autoComplete="email"
                    inputMode="email"
                  />
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <span>
                    Phone <span className="font-normal text-slate-400">(optional)</span>
                  </span>
                }
                name="phone"
                rules={[
                  { pattern: /^[+\d\s()/-]*$/, message: 'Enter a valid phone number' },
                  { max: 30, message: 'Phone number is too long' },
                ]}
              >
                <Input
                  prefix={<HiOutlinePhone className="text-slate-400" />}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+49 …"
                />
              </Form.Item>

              <Form.Item
                label="Message"
                name="message"
                extra={
                  <span className="flex justify-end text-xs text-slate-400">
                    {message.length.toLocaleString('de-DE')} / {MAX_MESSAGE.toLocaleString('de-DE')}
                  </span>
                }
                rules={[
                  { required: true, whitespace: true, message: 'Please write a message' },
                  { min: 10, message: 'Please write at least 10 characters' },
                  { max: MAX_MESSAGE, message: 'Message is too long' },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  maxLength={MAX_MESSAGE}
                  placeholder="Describe your question or issue. Include a booking reference if you have one."
                  style={{ resize: 'vertical' }}
                />
              </Form.Item>

              {/* Honeypot for bots: hidden from people and screen readers. */}
              <Form.Item name="website" className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
                <Input tabIndex={-1} autoComplete="off" />
              </Form.Item>

              <Button type="primary" htmlType="submit" block loading={isLoading}>
                Send message
              </Button>
              <p className="mt-3 text-center text-xs text-slate-400">
                We only use your details to answer this request.
              </p>
            </Form>
          )}
        </section>

        <aside className="space-y-4">
          {[
            {
              icon: HiOutlineClock,
              title: 'Fast replies',
              text: 'We usually answer within 1–2 business days.',
            },
            {
              icon: HiOutlineChatBubbleLeftRight,
              title: 'Bookings & payments',
              text: 'Add your booking date and salon name so we can help faster.',
            },
            {
              icon: HiOutlineShieldCheck,
              title: 'Your privacy',
              text: 'Never share passwords or full card numbers in your message.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white p-5 ring-1 ring-inset ring-slate-200">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-semibold text-slate-900">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}

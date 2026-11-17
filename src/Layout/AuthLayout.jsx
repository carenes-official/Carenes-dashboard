import loginImage from '../assets/login.png'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex w-full flex-col justify-between px-6 py-8 sm:px-12 lg:w-1/2 lg:px-20">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">
            C
          </span>
          <span className="text-lg font-semibold tracking-wide text-slate-900">CARENES</span>
        </div>

        <div className="mx-auto w-full max-w-sm py-10">
          <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
        </div>

        <p className="text-xs text-slate-400">© {new Date().getFullYear()} Carenes. Admin access only.</p>
      </div>

      <div className="relative hidden lg:block lg:w-1/2">
        <img src={loginImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D40]/90 via-[#0B3D40]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="text-2xl font-semibold leading-snug">
            Everything your salon platform needs, in one place.
          </p>
          <p className="mt-2 max-w-md text-sm text-white/75">
            Manage shops, customers, payments and the legal content shown in the Carenes apps.
          </p>
        </div>
      </div>
    </div>
  )
}

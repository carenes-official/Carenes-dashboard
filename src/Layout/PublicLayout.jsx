import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const NAV = [
  { to: '/terms-conditions', label: 'Terms' },
  { to: '/privacy-policy', label: 'Privacy' },
  { to: '/support', label: 'Support' },
]

export default function PublicLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7F9]">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/terms-conditions" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-base font-bold text-white">
              C
            </span>
            <span className="text-[15px] font-semibold tracking-wide text-slate-900">CARENES</span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Legal and support">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Carenes. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/terms-conditions" className="hover:text-slate-900">Terms & Conditions</Link>
            <Link to="/privacy-policy" className="hover:text-slate-900">Privacy Policy</Link>
            <Link to="/imprint" className="hover:text-slate-900">Imprint</Link>
            <Link to="/support" className="hover:text-slate-900">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

import { NavLink, useLocation } from 'react-router-dom'
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { NAV_SECTIONS } from './navigation'
import useLogout from '../../hooks/useLogout'
import { useGetSupportTicketsQuery } from '../../Redux/supportApis'

const linkBase =
  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors duration-150'

export default function Sidebar({ onNavigate }) {
  const logout = useLogout()
  const { pathname } = useLocation()
  // Pending support requests, shown as a badge on the menu item.
  const { data: supportData } = useGetSupportTicketsQuery(
    { status: 'pending', limit: 1 },
    { pollingInterval: 60_000, refetchOnFocus: true, skipPollingIfUnfocused: true }
  )
  const badges = { support: supportData?.data?.meta?.statusCounts?.pending ?? 0 }

  return (
    <aside className="flex h-full w-full flex-col bg-[#0B3D40] text-white">
      <div className="flex h-16 shrink-0 items-center gap-3 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-lg font-bold ring-1 ring-white/15">
          C
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold tracking-wide">CARENES</p>
          <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Main">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ name, to, icon: Icon, end, match, badge }) => {
                const extraActive = match?.some((m) => pathname.startsWith(m))
                return (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `${linkBase} ${
                          isActive || extraActive
                            ? 'bg-white text-[#0B3D40] shadow-sm'
                            : 'text-white/75 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{name}</span>
                      {badge && badges[badge] > 0 && (
                        <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold leading-none text-[#0B3D40]">
                          {badges[badge] > 99 ? '99+' : badges[badge]}
                        </span>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={logout}
          className={`${linkBase} w-full cursor-pointer bg-transparent text-white/75 hover:bg-white/10 hover:text-white`}
        >
          <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
          Log out
        </button>
      </div>
    </aside>
  )
}

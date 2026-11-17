import { Avatar, Dropdown } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  HiBars3,
  HiOutlineUserCircle,
  HiOutlineKey,
  HiOutlineArrowRightOnRectangle,
  HiChevronDown,
} from 'react-icons/hi2'
import NotificationBell from './NotificationBell'
import { titleForPath } from './navigation'
import { useGetProfileInformationQuery } from '../../Redux/profileApis'
import { imageUrl, initials } from '../../lib/format'
import useLogout from '../../hooks/useLogout'

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const logout = useLogout()
  const { data } = useGetProfileInformationQuery()
  const profile = data?.data

  const menuItems = [
    {
      key: 'profile',
      icon: <HiOutlineUserCircle className="h-4 w-4" />,
      label: 'Account settings',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'password',
      icon: <HiOutlineKey className="h-4 w-4" />,
      label: 'Change password',
      onClick: () => navigate('/change-password'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      danger: true,
      icon: <HiOutlineArrowRightOnRectangle className="h-4 w-4" />,
      label: 'Log out',
      onClick: logout,
    },
  ]

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200/70 bg-white/85 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden"
        >
          <HiBars3 className="h-5 w-5" />
        </button>
        <p className="truncate text-[15px] font-semibold text-slate-900">{titleForPath(pathname)}</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationBell />
        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-2 transition hover:bg-slate-50 sm:pr-3"
          >
            <Avatar
              src={imageUrl(profile?.profile_image)}
              size={32}
              className="bg-brand-50 font-semibold text-brand-700"
            >
              {initials(profile?.name)}
            </Avatar>
            <span className="hidden min-w-0 text-left sm:block">
              <span className="block max-w-[160px] truncate text-sm font-medium text-slate-900">
                {profile?.name || 'Admin'}
              </span>
              <span className="block max-w-[160px] truncate text-xs text-slate-500">
                {profile?.email}
              </span>
            </span>
            <HiChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>
        </Dropdown>
      </div>
    </header>
  )
}

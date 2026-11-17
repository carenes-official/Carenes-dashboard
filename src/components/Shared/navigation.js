import {
  HiOutlineSquares2X2,
  HiOutlineBuildingStorefront,
  HiOutlineSparkles,
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineTag,
  HiOutlineBanknotes,
  HiOutlineArrowsRightLeft,
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineBuildingOffice2,
  HiOutlineLifebuoy,
} from 'react-icons/hi2'

export const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ name: 'Dashboard', to: '/', icon: HiOutlineSquares2X2, end: true }],
  },
  {
    label: 'Management',
    items: [
      { name: 'Shops', to: '/shops', icon: HiOutlineBuildingStorefront, match: ['/shop-details'] },
      { name: 'Services', to: '/services', icon: HiOutlineSparkles },
      { name: 'Customers', to: '/customers', icon: HiOutlineUsers },
      { name: 'Staff', to: '/staff', icon: HiOutlineUserGroup },
      { name: 'Categories', to: '/categories', icon: HiOutlineTag },
    ],
  },
  {
    label: 'Finance',
    items: [
      { name: 'Pay on Shop', to: '/pay-on-shop', icon: HiOutlineBanknotes },
      { name: 'Transactions', to: '/transaction', icon: HiOutlineArrowsRightLeft },
    ],
  },
  {
    label: 'Customer Care',
    items: [
      { name: 'Support requests', to: '/support-requests', icon: HiOutlineLifebuoy, badge: 'support' },
    ],
  },
  {
    label: 'Legal & App Content',
    items: [
      { name: 'Terms & Conditions', to: '/legal/terms-conditions', icon: HiOutlineDocumentText },
      { name: 'Privacy Policy', to: '/legal/privacy-policy', icon: HiOutlineShieldCheck },
      { name: 'Imprint', to: '/legal/imprint', icon: HiOutlineBuildingOffice2 },
    ],
  },
]

const flatItems = NAV_SECTIONS.flatMap((section) => section.items)

const EXTRA_TITLES = {
  '/profile': 'Account settings',
  '/change-password': 'Change password',
}

export const titleForPath = (pathname) => {
  if (EXTRA_TITLES[pathname]) return EXTRA_TITLES[pathname]
  const match = flatItems
    .filter((item) =>
      item.end
        ? pathname === item.to
        : pathname.startsWith(item.to) || item.match?.some((m) => pathname.startsWith(m))
    )
    .sort((a, b) => b.to.length - a.to.length)[0]
  return match?.name || 'Dashboard'
}

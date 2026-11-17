import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Drawer } from 'antd'
import Sidebar from '../components/Shared/Sidebar'
import Navbar from '../components/Shared/Navbar'
import { LoadingBlock } from '../components/ui/QueryState'

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  // Each page starts at the top.
  useEffect(() => {
    document.getElementById('main-scroll')?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7F9]">
      <div className="hidden w-[264px] shrink-0 lg:block">
        <Sidebar />
      </div>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        placement="left"
        width={272}
        closable={false}
        styles={{ body: { padding: 0 } }}
        className="lg:hidden"
      >
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main id="main-scroll" className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Suspense fallback={<LoadingBlock />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}

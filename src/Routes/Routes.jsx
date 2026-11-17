import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Dashboard from '../Layout/Dashboard'
import AdminRoute, { GuestRoute } from '../ProtectedRoute/AdminRoute'
import RouteError from '../Pages/RouteError'
import PublicLayout from '../Layout/PublicLayout'

// Route-level code splitting: heavy pages (charts, rich-text editor) load on demand.
const DashboardHome = lazy(() => import('../Pages/DashboardHome'))
const Shops = lazy(() => import('../Pages/Shops'))
const ShopDetails = lazy(() => import('../Pages/ShopDetails'))
const Services = lazy(() => import('../Pages/Services'))
const CategoryDetails = lazy(() => import('../Pages/CategoryDetails'))
const Customers = lazy(() => import('../Pages/Customers'))
const Staff = lazy(() => import('../Pages/Staff'))
const Category = lazy(() => import('../Pages/Category'))
const PayOnShop = lazy(() => import('../Pages/PayOnShop'))
const Transaction = lazy(() => import('../Pages/Transaction'))
const TermsConditions = lazy(() => import('../Pages/TermsConditions'))
const PrivacyPolicy = lazy(() => import('../Pages/PrivacyPolicy'))
const Imprint = lazy(() => import('../Pages/Imprint'))
const SupportRequests = lazy(() => import('../Pages/SupportRequests'))
const Profile = lazy(() => import('../Pages/Profile'))
const ChangePassword = lazy(() => import('../Pages/ChangePassword'))
const Login = lazy(() => import('../Pages/auth/Login'))
const ForgetPassword = lazy(() => import('../Pages/auth/ForgetPassword'))
const ResetPassword = lazy(() => import('../Pages/auth/ResetPassword'))
const NotFound = lazy(() => import('../Pages/NotFound'))
const PublicTerms = lazy(() => import('../Pages/public/PublicTerms'))
const PublicPrivacy = lazy(() => import('../Pages/public/PublicPrivacy'))
const PublicImprint = lazy(() => import('../Pages/public/PublicImprint'))
const Support = lazy(() => import('../Pages/public/Support'))

const publicPage = (element) => (
  <Suspense fallback={<div className="min-h-[60vh]" />}>{element}</Suspense>
)

const guest = (element) => (
  <GuestRoute>
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7F9]" />}>{element}</Suspense>
  </GuestRoute>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'shops', element: <Shops /> },
      { path: 'shop-details/:id', element: <ShopDetails /> },
      { path: 'services', element: <Services /> },
      { path: 'services/:id', element: <CategoryDetails /> },
      { path: 'customers', element: <Customers /> },
      { path: 'staff', element: <Staff /> },
      { path: 'categories', element: <Category /> },
      { path: 'pay-on-shop', element: <PayOnShop /> },
      { path: 'transaction', element: <Transaction /> },
      { path: 'legal/terms-conditions', element: <TermsConditions /> },
      { path: 'legal/privacy-policy', element: <PrivacyPolicy /> },
      { path: 'legal/imprint', element: <Imprint /> },
      { path: 'support-requests', element: <SupportRequests /> },
      { path: 'profile', element: <Profile /> },
      { path: 'change-password', element: <ChangePassword /> },
      // Old links kept working.
      { path: 'terms-&-conditions', element: <Navigate to="/legal/terms-conditions" replace /> },
      { path: 'recent-customers', element: <Navigate to="/customers" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  // Public pages (no login): linked from the apps and the app store listings.
  {
    element: <PublicLayout />,
    errorElement: <RouteError />,
    children: [
      { path: '/terms-conditions', element: publicPage(<PublicTerms />) },
      { path: '/privacy-policy', element: publicPage(<PublicPrivacy />) },
      { path: '/imprint', element: publicPage(<PublicImprint />) },
      { path: '/support', element: publicPage(<Support />) },
    ],
  },
  { path: '/login', element: guest(<Login />), errorElement: <RouteError /> },
  { path: '/forget-password', element: guest(<ForgetPassword />), errorElement: <RouteError /> },
  { path: '/reset-password', element: guest(<ResetPassword />), errorElement: <RouteError /> },
])

export default router

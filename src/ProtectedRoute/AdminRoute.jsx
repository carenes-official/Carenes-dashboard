import { Navigate, useLocation } from 'react-router-dom'
import { clearSession, getToken, isTokenValid } from '../lib/auth'

export default function AdminRoute({ children }) {
  const location = useLocation()
  if (!isTokenValid()) {
    if (getToken()) clearSession()
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

export function GuestRoute({ children }) {
  if (isTokenValid()) return <Navigate to="/" replace />
  return children
}

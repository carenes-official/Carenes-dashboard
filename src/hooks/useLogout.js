import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { baseApis } from '../Redux/baseApis'
import { clearSession } from '../lib/auth'

export default function useLogout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return useCallback(() => {
    clearSession()
    // Drop every cached response so the next admin never sees stale data.
    dispatch(baseApis.util.resetApiState())
    navigate('/login', { replace: true })
  }, [dispatch, navigate])
}

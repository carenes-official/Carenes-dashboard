import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { url } from './server'
import { clearSession, getToken } from '../lib/auth'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: url,
  // Read the token on every request so a fresh login is picked up immediately.
  prepareHeaders: (headers) => {
    const token = getToken()
    if (token) headers.set('Authorization', token)
    return headers
  },
})

// Drop undefined/empty params so the backend QueryBuilder never filters on "".
const cleanParams = (args) => {
  if (typeof args !== 'object' || !args?.params) return args
  const params = Object.fromEntries(
    Object.entries(args.params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  )
  return { ...args, params }
}

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(cleanParams(args), api, extraOptions)
  // Expired/invalid session: clear it and send the admin back to login.
  if (result.error?.status === 401 && getToken()) {
    clearSession()
    if (!window.location.pathname.startsWith('/login')) {
      window.location.assign('/login')
    }
  }
  return result
}

export const baseApis = createApi({
  reducerPath: 'salonApis',
  baseQuery,
  refetchOnReconnect: true,
  tagTypes: [
    'customers',
    'category',
    'privacyPolicy',
    'termsAndCondition',
    'imprint',
    'shop',
    'profile',
    'notifications',
    'manageProfile',
    'payOnShop',
    'support',
  ],
  endpoints: () => ({}),
})

export const getErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.data?.message || error?.error || fallback

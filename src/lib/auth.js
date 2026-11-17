import { jwtDecode } from 'jwt-decode'

const TOKEN_KEY = 'token'
const ROLE_KEY = 'role'
const RESET_EMAIL_KEY = 'email'

// Older builds stored values JSON-stringified ('"abc"'), newer ones store raw.
const readValue = (key) => {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return typeof parsed === 'string' ? parsed : raw
  } catch {
    return raw
  }
}

export const getToken = () => readValue(TOKEN_KEY)

export const decodeToken = (token = getToken()) => {
  if (!token) return null
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

export const isTokenValid = (token = getToken()) => {
  const decoded = decodeToken(token)
  if (!decoded) return false
  return !decoded.exp || decoded.exp * 1000 > Date.now()
}

export const getRole = () => decodeToken()?.role || readValue(ROLE_KEY)

export const isSuperAdmin = () => getRole() === 'superAdmin'

export const setSession = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
  const role = decodeToken(token)?.role
  if (role) localStorage.setItem(ROLE_KEY, role)
}

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ROLE_KEY)
}

export const resetEmail = {
  get: () => localStorage.getItem(RESET_EMAIL_KEY),
  set: (email) => localStorage.setItem(RESET_EMAIL_KEY, email),
  clear: () => localStorage.removeItem(RESET_EMAIL_KEY),
}

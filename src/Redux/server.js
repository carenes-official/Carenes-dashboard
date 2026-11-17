// Override per environment with VITE_API_URL (e.g. in .env.local).
export const url = (import.meta.env.VITE_API_URL || 'https://api.carenes.de').replace(
  /\/+$/,
  ''
)

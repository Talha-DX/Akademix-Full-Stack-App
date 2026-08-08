import axios from 'axios'

// Base HTTP client for every *Api.js file in this folder.
// Points at the backend once VITE_API_URL is set in .env — see
// backend/README.md for the matching route list.
// const client = axios.create({
//   baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
//   headers: { 'Content-Type': 'application/json' },
// })

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
})

// "Remember me" on the login form decides which of these the token lands
// in: localStorage survives closing the browser, sessionStorage clears
// when the tab closes. Read both so either kind of session keeps working.
export function getStoredToken() {
  return localStorage.getItem('akademix_token') ?? sessionStorage.getItem('akademix_token')
}

client.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default client

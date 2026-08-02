import axios from 'axios'

// Base HTTP client for every *Api.js file in this folder.
// Points at the backend once VITE_API_URL is set in .env — see
// backend/README.md for the matching route list.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('akademix_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default client

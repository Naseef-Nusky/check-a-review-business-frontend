import { API_BASE_URL } from '../utils/constants'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('business_token')

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new ApiError(error.message || 'Request failed', response.status)
  }

  if (response.status === 204) return null
  return response.json()
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (endpoint, data) => request(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
}

export { ApiError }

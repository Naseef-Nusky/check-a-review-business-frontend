import { API_BASE_URL } from '../utils/constants'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('business_token')
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const json = await response.json().catch(() => ({ message: 'Request failed' }))

  if (!response.ok) {
    throw new ApiError(json.message || 'Request failed', response.status)
  }

  if (response.status === 204) return null
  return json.data !== undefined ? json.data : json
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (endpoint, data) => request(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
  upload: (endpoint, formData) => request(endpoint, { method: 'POST', body: formData }),
}

export const businessApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  getMyProfile: () => api.get('/businesses/my/profile'),
  updateBusiness: (id, data) => api.put(`/businesses/${id}`, data),
  uploadLogo: (id, file) => {
    const formData = new FormData()
    formData.append('logo', file)
    return api.upload(`/businesses/${id}/logo`, formData)
  },
  getCategories: () => api.get('/businesses/categories'),
  getPricingContent: () => api.get('/businesses/pricing'),
  getReviews: (businessId) => api.get(`/reviews/business/${businessId}?limit=50`),
  replyToReview: (reviewId, reply) => api.post(`/reviews/${reviewId}/reply`, { reply }),
  getInvitations: (businessId) => api.get(`/reviews/invitations/${businessId}`),
  sendInvitation: (businessId, email) => api.post('/reviews/invitations', { businessId, email }),
  getAnalytics: (businessId) => api.get(`/businesses/${businessId}/analytics`),
  getWidget: (businessId) => api.get(`/widget/${businessId}`),
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.patch('/notifications/read-all'),
}

export { ApiError }

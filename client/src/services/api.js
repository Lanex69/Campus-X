const rawUrl = import.meta.env.VITE_API_URL || '/api';
const API_URL = rawUrl.replace(/\/$/, '');

async function request(endpoint, options = {}) {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // Crucial for httpOnly cookie auth
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error((data && data.message) || response.statusText || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    getMe: () => request('/auth/me'),
  },

  users: {
    updateProfile: (profile) => request('/users/profile', { method: 'PUT', body: JSON.stringify(profile) }),
    changePassword: (passwords) => request('/users/change-password', { method: 'PUT', body: JSON.stringify(passwords) }),
  },

  services: {
    getServices: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') query.append(key, val);
      });
      const qs = query.toString();
      return request(`/services${qs ? `?${qs}` : ''}`);
    },
    getService: (id) => request(`/services/${id}`),
    createService: (data) => request('/services', { method: 'POST', body: JSON.stringify(data) }),
    updateService: (id, data) => request(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    toggleStatus: (id) => request(`/services/${id}/toggle`, { method: 'PATCH' }),
  },

  bookings: {
    createBooking: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    getMyBookings: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/bookings/my${query ? `?${query}` : ''}`);
    },
    getBooking: (id) => request(`/bookings/${id}`),
    cancelBooking: (id, reason) => request(`/bookings/${id}/cancel`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  },

  payments: {
    getMyPayments: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/payments/my${query ? `?${query}` : ''}`);
    },
    processPayment: (bookingId, data = {}) => request(`/payments/${bookingId}/pay`, { method: 'POST', body: JSON.stringify(data) }),
  },

  feedback: {
    createFeedback: (data) => request('/feedback', { method: 'POST', body: JSON.stringify(data) }),
    getServiceFeedback: (serviceId) => request(`/feedback/service/${serviceId}`),
  },

  admin: {
    getDashboardStats: () => request('/admin/dashboard'),
    getUsers: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/users${query ? `?${query}` : ''}`);
    },
    getUserDetails: (id) => request(`/admin/users/${id}`),
    getAllBookings: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/bookings${query ? `?${query}` : ''}`);
    },
    updateBookingStatus: (id, status, adminNotes) =>
      request(`/admin/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminNotes }),
      }),
    getAllPayments: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/payments${query ? `?${query}` : ''}`);
    },
    getAllFeedback: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/feedback${query ? `?${query}` : ''}`);
    },
  },
};

export default api;

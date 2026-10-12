import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gym.crmbot.uz/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccess = res.data.access;
          localStorage.setItem('access_token', newAccess);
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// API Service modules
export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (data) => api.post('/auth/register/', data),
  logout: (refreshToken) => api.post('/auth/logout/', { refresh: refreshToken }),
  getProfile: () => api.get('/users/me/'),
  updateProfile: (data) => api.patch('/users/me/', data),
};

export const statsService = {
  getDashboardStats: () => api.get('/stats/dashboard/'),
  getMyStats: () => api.get('/stats/my/'),
};

export const usersService = {
  getUsers: (params) => api.get('/users/', { params }),
  getUser: (id) => api.get(`/users/${id}/`),
  updateUser: (id, data) => api.patch(`/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/users/${id}/`),
  getUserProgress: (id) => api.get(`/progress/user/${id}/`),
};

export const phasesService = {
  getPhases: (params) => api.get('/phases/', { params }),
  getPhase: (id) => api.get(`/phases/${id}/`),
  createPhase: (data) => api.post('/phases/', data),
  updatePhase: (id, data) => api.patch(`/phases/${id}/`, data),
  deletePhase: (id) => api.delete(`/phases/${id}/`),
};

export const workoutsService = {
  getWorkouts: (params) => api.get('/workouts/', { params }),
  getWorkout: (id) => api.get(`/workouts/${id}/`),
  createWorkout: (data) => api.post('/workouts/', data),
  updateWorkout: (id, data) => api.patch(`/workouts/${id}/`, data),
  deleteWorkout: (id) => api.delete(`/workouts/${id}/`),
};

export const exercisesService = {
  getExercises: (params) => api.get('/exercises/', { params }),
  getExercise: (id) => api.get(`/exercises/${id}/`),
  createExercise: (formData) => api.post('/exercises/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateExercise: (id, formData) => api.patch(`/exercises/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteExercise: (id) => api.delete(`/exercises/${id}/`),
  reorderExercises: (items) => api.post('/exercises/reorder/', { items }),
};

export const resultsService = {
  getSessions: (params) => api.get('/sessions/', { params }),
  getSessionDetail: (id) => api.get(`/sessions/${id}/`),
};

export default api;

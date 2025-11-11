import axios from 'axios';

export const API_BASE_URL = 'https://api.yourrestaurantapp.com';
export const AUTH_TOKEN_KEY = 'authToken';

// API Endpoints
export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  RESERVATIONS: `${API_BASE_URL}/reservations`,
  INVENTORY: `${API_BASE_URL}/inventory`,
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  PAYMENTS: `${API_BASE_URL}/payments`,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error, please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access to this resource is forbidden.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  RESERVATION_CREATED: 'Reservation created successfully!',
  INVENTORY_UPDATED: 'Inventory updated successfully!',
};

// Loading Messages
export const LOADING_MESSAGES = {
  LOADING: 'Loading, please wait...',
  SAVING: 'Saving changes, please wait...',
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long.',
};

// Utility Functions
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Axios Instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          removeAuthToken();
          window.location.href = '/login';
          break;
        case 403:
          alert(ERROR_MESSAGES.FORBIDDEN);
          break;
        case 404:
          alert(ERROR_MESSAGES.NOT_FOUND);
          break;
        case 500:
          alert(ERROR_MESSAGES.SERVER_ERROR);
          break;
        default:
          alert(ERROR_MESSAGES.NETWORK_ERROR);
      }
    } else {
      alert(ERROR_MESSAGES.NETWORK_ERROR);
    }
    return Promise.reject(error);
  }
);
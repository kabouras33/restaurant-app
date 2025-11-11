import axios from 'axios';

export const API_BASE_URL = 'https://api.yourrestaurantapp.com';
export const STRIPE_PUBLIC_KEY = 'pk_test_1234567890abcdef';
export const AWS_S3_BUCKET_URL = 'https://yourbucket.s3.amazonaws.com';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  },
  RESERVATIONS: {
    BASE: `${API_BASE_URL}/reservations`,
    CREATE: `${API_BASE_URL}/reservations/create`,
    UPDATE: `${API_BASE_URL}/reservations/update`,
    DELETE: `${API_BASE_URL}/reservations/delete`,
  },
  INVENTORY: {
    BASE: `${API_BASE_URL}/inventory`,
    ADD: `${API_BASE_URL}/inventory/add`,
    UPDATE: `${API_BASE_URL}/inventory/update`,
    DELETE: `${API_BASE_URL}/inventory/delete`,
  },
  PAYMENTS: {
    CREATE_SESSION: `${API_BASE_URL}/payments/create-session`,
  },
  REPORTS: {
    GENERATE: `${API_BASE_URL}/reports/generate`,
  },
  NOTIFICATIONS: {
    EMAIL: `${API_BASE_URL}/notifications/email`,
    SMS: `${API_BASE_URL}/notifications/sms`,
  },
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error, please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access to this resource is forbidden.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
};

export const HEADERS = {
  JSON: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const fetchWithErrorHandling = async (url: string, options: any) => {
  try {
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
          case 403:
            throw new Error(ERROR_MESSAGES.FORBIDDEN);
          case 404:
            throw new Error(ERROR_MESSAGES.NOT_FOUND);
          case 500:
            throw new Error(ERROR_MESSAGES.SERVER_ERROR);
          default:
            throw new Error(error.response.data.message || ERROR_MESSAGES.SERVER_ERROR);
        }
      } else if (error.request) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
    }
    throw new Error(ERROR_MESSAGES.SERVER_ERROR);
  }
};
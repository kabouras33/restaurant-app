import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface LoginResponse {
  token: string;
}

interface ErrorResponse {
  message: string;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      const errorResponse: ErrorResponse = {
        message: error.response.data.message || 'An error occurred',
      };
      return Promise.reject(errorResponse);
    }
    return Promise.reject({ message: 'Network error' });
  }
);

export const login = async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
    localStorage.setItem('authToken', response.data.data.token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchReservations = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>('/reservations');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createReservation = async (reservationData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>('/reservations', reservationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchInventory = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>('/inventory');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateInventory = async (inventoryId: string, inventoryData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.put<ApiResponse<any>>(`/inventory/${inventoryId}`, inventoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchNotifications = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>('/notifications');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
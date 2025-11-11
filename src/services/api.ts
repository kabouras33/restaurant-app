import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: User;
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
    const { user } = useAuth();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        // Handle unauthorized access
        useAuth().logout();
      }
      return Promise.reject(data as ErrorResponse);
    }
    return Promise.reject({ message: 'Network Error' });
  }
);

export const login = async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
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

export const updateInventory = async (inventoryData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.put<ApiResponse<any>>('/inventory', inventoryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const processPayment = async (paymentData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>('/payments', paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
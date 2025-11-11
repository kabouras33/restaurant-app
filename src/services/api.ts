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
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      const errorResponse: ErrorResponse = error.response.data;
      return Promise.reject(new Error(errorResponse.message || 'An error occurred'));
    }
    return Promise.reject(new Error('Network Error'));
  }
);

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<ApiResponse<LoginResponse>> = await apiClient.post('/auth/login', { email, password });
    return response.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchUserProfile = async (): Promise<User> => {
  try {
    const response: AxiosResponse<ApiResponse<User>> = await apiClient.get('/user/profile');
    return response.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUserProfile = async (user: Partial<User>): Promise<User> => {
  try {
    const response: AxiosResponse<ApiResponse<User>> = await apiClient.put('/user/profile', user);
    return response.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchReservations = async (): Promise<any[]> => {
  try {
    const response: AxiosResponse<ApiResponse<any[]>> = await apiClient.get('/reservations');
    return response.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createReservation = async (reservationData: any): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.post('/reservations', reservationData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchInventory = async (): Promise<any[]> => {
  try {
    const response: AxiosResponse<ApiResponse<any[]>> = await apiClient.get('/inventory');
    return response.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateInventoryItem = async (itemId: string, itemData: any): Promise<any> => {
  try {
    const response: AxiosResponse<ApiResponse<any>> = await apiClient.put(`/inventory/${itemId}`, itemData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default apiClient;
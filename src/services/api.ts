import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface ErrorResponse {
  message: string;
  status: number;
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const { user } = useAuth();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse): ApiResponse<any> => {
    return {
      data: response.data,
      message: response.statusText,
      success: true,
    };
  },
  (error: AxiosError): Promise<ErrorResponse> => {
    let errorMessage = 'An unexpected error occurred';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    return Promise.reject({
      message: errorMessage,
      status: error.response ? error.response.status : 500,
    });
  }
);

export const fetchReservations = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get('/reservations');
    return response;
  } catch (error) {
    throw error;
  }
};

export const createReservation = async (reservationData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post('/reservations', reservationData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateReservation = async (id: string, reservationData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.put(`/reservations/${id}`, reservationData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteReservation = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.delete(`/reservations/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchInventory = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get('/inventory');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateInventoryItem = async (id: string, itemData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.put(`/inventory/${id}`, itemData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteInventoryItem = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await api.delete(`/inventory/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const processPayment = async (paymentData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post('/payments', paymentData);
    return response;
  } catch (error) {
    throw error;
  }
};

export default api;
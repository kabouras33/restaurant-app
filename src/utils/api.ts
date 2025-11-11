import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface ApiError {
  message: string;
  status: number;
}

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
    };
    return Promise.reject(apiError);
  }
);

export async function fetchData<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.get<T>(url, config);
    return { data: response.data };
  } catch (error) {
    return { data: null as any, error: (error as ApiError).message };
  }
}

export async function postData<T, R>(url: string, data: T, config?: AxiosRequestConfig): Promise<ApiResponse<R>> {
  try {
    const response = await apiClient.post<R>(url, data, config);
    return { data: response.data };
  } catch (error) {
    return { data: null as any, error: (error as ApiError).message };
  }
}

export async function putData<T, R>(url: string, data: T, config?: AxiosRequestConfig): Promise<ApiResponse<R>> {
  try {
    const response = await apiClient.put<R>(url, data, config);
    return { data: response.data };
  } catch (error) {
    return { data: null as any, error: (error as ApiError).message };
  }
}

export async function deleteData<R>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<R>> {
  try {
    const response = await apiClient.delete<R>(url, config);
    return { data: response.data };
  } catch (error) {
    return { data: null as any, error: (error as ApiError).message };
  }
}

export default apiClient;
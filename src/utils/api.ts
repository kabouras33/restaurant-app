import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

async function fetchData<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await api.get<T>(url, config);
    return { data: response.data };
  } catch (error) {
    return { data: null as any, error: error.message };
  }
}

async function postData<T, U>(url: string, data: T, config?: AxiosRequestConfig): Promise<ApiResponse<U>> {
  try {
    const response = await api.post<U>(url, data, config);
    return { data: response.data };
  } catch (error) {
    return { data: null as any, error: error.message };
  }
}

async function putData<T, U>(url: string, data: T, config?: AxiosRequestConfig): Promise<ApiResponse<U>> {
  try {
    const response = await api.put<U>(url, data, config);
    return { data: response.data };
  } catch (error) {
    return { data: null as any, error: error.message };
  }
}

async function deleteData<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response = await api.delete<T>(url, config);
    return { data: response.data };
  } catch (error) {
    return { data: null as any, error: error.message };
  }
}

export { fetchData, postData, putData, deleteData };
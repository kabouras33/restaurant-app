import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse<T> {
  data: T;
  error: string | null;
}

interface FetchOptions extends AxiosRequestConfig {
  authRequired?: boolean;
}

const API_BASE_URL = 'https://api.yourrestaurantapp.com';

const fetchWrapper = async <T>(url: string, options: FetchOptions = {}): Promise<ApiResponse<T>> => {
  const { authRequired, ...axiosOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authRequired) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      return { data: null as any, error: 'Authentication required' };
    }
  }

  try {
    const response: AxiosResponse<T> = await axios({
      url: `${API_BASE_URL}${url}`,
      headers,
      ...axiosOptions,
    });
    return { data: response.data, error: null };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return { data: null as any, error: error.response?.data?.message || 'An error occurred' };
    }
    return { data: null as any, error: 'An unexpected error occurred' };
  }
};

export const apiClient = {
  get: <T>(url: string, options?: FetchOptions) => fetchWrapper<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, data: any, options?: FetchOptions) => fetchWrapper<T>(url, { ...options, method: 'POST', data }),
  put: <T>(url: string, data: any, options?: FetchOptions) => fetchWrapper<T>(url, { ...options, method: 'PUT', data }),
  delete: <T>(url: string, options?: FetchOptions) => fetchWrapper<T>(url, { ...options, method: 'DELETE' }),
};

export default apiClient;
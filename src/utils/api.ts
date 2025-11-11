import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

interface ApiError {
  message: string;
  status: number;
}

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
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
  (response: AxiosResponse): ApiResponse<any> => {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  },
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
    };
    return Promise.reject(apiError);
  }
);

export const fetchData = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.get<T>(url, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postData = async <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.post<T>(url, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putData = async <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.put<T>(url, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.delete<T>(url, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
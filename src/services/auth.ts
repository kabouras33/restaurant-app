import axios, { AxiosInstance } from 'axios';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ErrorResponse {
  message: string;
}

class AuthService {
  private api: AxiosInstance;
  private token: string | null;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.token = localStorage.getItem('token');
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/login', { email, password });
      this.token = response.data.token;
      localStorage.setItem('token', this.token);
      return response.data;
    } catch (error) {
      const errResponse = (error.response?.data as ErrorResponse) || { message: 'Login failed' };
      throw new Error(errResponse.message);
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  async refreshToken(): Promise<void> {
    try {
      const response = await this.api.post<{ token: string }>('/auth/refresh');
      this.token = response.data.token;
      localStorage.setItem('token', this.token);
    } catch (error) {
      const errResponse = (error.response?.data as ErrorResponse) || { message: 'Token refresh failed' };
      throw new Error(errResponse.message);
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();
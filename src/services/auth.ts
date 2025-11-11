import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface LoginRequest {
  email: string;
  password: string;
}

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
      baseURL: 'https://api.yourrestaurantapp.com',
      headers: {
        'Content-Type': 'application/json',
      },
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

  async login(data: LoginRequest): Promise<LoginResponse | ErrorResponse> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', data);
      this.token = response.data.token;
      localStorage.setItem('token', this.token);
      return response.data;
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Login failed' };
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  async fetchUserProfile(): Promise<LoginResponse['user'] | ErrorResponse> {
    try {
      const response: AxiosResponse<LoginResponse['user']> = await this.api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Failed to fetch user profile' };
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

const authService = new AuthService();
export default authService;
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Add request interceptor to include token
axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('auth_token');
      Cookies.remove('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  full_name: string;
  email: string;
  tenant_name: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store token and user data in cookies
      Cookies.set('auth_token', token, { expires: 1 }); // 1 day
      Cookies.set('user_data', JSON.stringify(user), { expires: 1 });
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const token = Cookies.get('auth_token');
      if (token) {
        await axios.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      Cookies.remove('auth_token');
      Cookies.remove('user_data');
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    const userData = Cookies.get('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = Cookies.get('auth_token');
    return !!token;
  }

  // Get user profile
  async getProfile(): Promise<User> {
    try {
      const response = await axios.get('/auth/profile');
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get profile');
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await axios.put('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  }
}

export default new AuthService();

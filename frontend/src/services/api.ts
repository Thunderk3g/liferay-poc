import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import type { LiferayAPIResponse, LiferayStructuredContent } from '@/types/liferay';

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create Axios instance
const apiClient: AxiosInstance = axios.create(API_CONFIG);

// Request interceptor - Add auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Basic Auth for development only
    // In production, replace with OAuth2 token
    const auth = btoa('test@liferay.com:test');
    config.headers.Authorization = `Basic ${auth}`;

    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          console.error('Unauthorized access - check credentials');
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error(`API Error: ${status}`);
      }
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Request configuration error:', error.message);
    }

    return Promise.reject(error);
  }
);

// API Methods
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};

// Liferay-specific API endpoints
export const liferayAPI = {
  // Get structured content from Liferay headless API
  getStructuredContent: async (siteId?: string): Promise<LiferayAPIResponse<LiferayStructuredContent>> => {
    const site = siteId || import.meta.env.VITE_LIFERAY_SITE_ID || '33815';
    return api.get(`/o/headless-delivery/v1.0/sites/${site}/structured-contents`);
  },

  // Get single structured content by ID
  getStructuredContentById: async (contentId: number): Promise<LiferayStructuredContent> => {
    return api.get(`/o/headless-delivery/v1.0/structured-contents/${contentId}`);
  },
};

export default apiClient;

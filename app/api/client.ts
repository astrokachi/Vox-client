import axios, { type AxiosInstance, type AxiosResponse, type AxiosRequestConfig } from 'axios';
import { parseApiError } from './parseError';

export const API_BASE = import.meta.env.VITE_API_URL;

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}


class ApiClient {
  private instance: AxiosInstance;
  private token: string | undefined;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create({
      ...config,
    })

    this.configureInterceptors();
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  private configureInterceptors() {
    // attach token to request if needed
    this.instance.interceptors.request.use((config) => {
      if (this.token && config.headers) {
        config.headers.Authorization = `Bearer ${this.token}`
      }

      return config;
    })

    this.instance.interceptors.response.use((response: AxiosResponse<ApiResponse<unknown>>) => {
      if (import.meta.env.MODE !== "production") {
        console.log(`${response.data.message} :`, {
          status: response.status,
          data: response.data,
        });
      }

      // return typed response data
      return response;

    }, async (error) => {
      //normalize response errors
      const apiError = parseApiError(error);
      //handle auth error
      if (apiError.code == 'UNAUTHORIZED') {
        window.location.href = "/logout";
      }

      return Promise.reject(apiError);
    })
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.get<ApiResponse<T>>(url, config);
    return res.data.data;
  }

  async post<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.instance.post<ApiResponse<T>>(url, body, config);
    return res.data.data;
  }

  async put<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.instance.put<ApiResponse<T>>(url, body, config);
    return res.data.data;
  }

  async patch<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.instance.patch<ApiResponse<T>>(url, body, config);
    return res.data.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.delete<ApiResponse<T>>(url, config);
    return res.data.data;
  }
}

export const internalApi = new ApiClient({
  timeout: 30000,
});

export const externalApi = new ApiClient({
  baseURL: API_BASE,
  timeout: 30000
});

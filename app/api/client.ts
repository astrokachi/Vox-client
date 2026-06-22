import axios, { type AxiosInstance, type AxiosResponse, type AxiosRequestConfig } from 'axios';
import { parseApiError } from './parseError';
import { getAccessToken, isTokenExpiredOrExpiring } from '~/lib/auth';
import { ensureToken } from '~/lib/ensure-token';
import type { ApiResponse } from '~/types';

export const API_BASE = import.meta.env.VITE_API_URL;

class ApiClient {
  private instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create({
      ...config,
    })

    this.configureInterceptors();
  }

  private configureInterceptors() {
    this.instance.interceptors.request.use(async (config) => {
      if (!config.headers) return config;

      let token = getAccessToken();

      if (token && isTokenExpiredOrExpiring(token)) {
        token = await ensureToken();
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    })

    this.instance.interceptors.response.use((response: AxiosResponse<ApiResponse<unknown>>) => {
      if (import.meta.env.MODE !== "production") {
        console.log(`${response.data.message || "RESPONSE"} :`, {
          status: response.status,
          data: response.data,
        });
      }

      // return typed response data
      return response;

    },
      async (error) => {
        const apiError = parseApiError(error);
        const originalRequest = error.config;

        if (apiError.code === 'UNAUTHORIZED' && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await ensureToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            return Promise.reject(parseApiError(refreshError));
          }
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

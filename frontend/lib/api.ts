import axios, { AxiosInstance } from 'axios';
import {
  User,
  Trade,
  Module,
  Procedure,
  ProcedureStep,
  PaginatedResponse,
  LoginPayload,
  RegisterPayload,
} from './types';

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/**
 * Client-facing axios instance for browser calls to Next.js route handlers.
 * Communicates via same-origin cookies (httpOnly) without exposing raw JWTs.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Server-side axios instance used by Next.js Route Handlers to call Django directly.
 */
export const backendClient: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Auth API client for browser UI components
 */
export const authApi = {
  async login(payload: LoginPayload): Promise<{ user: User }> {
    const response = await apiClient.post<{ user: User }>('/api/auth/login', payload);
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<{ user: User }> {
    const response = await apiClient.post<{ user: User }>('/api/auth/register', payload);
    return response.data;
  },

  async me(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ user: User }>('/api/auth/me');
      return response.data.user;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },

  async refresh(): Promise<boolean> {
    try {
      await apiClient.post('/api/auth/refresh');
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Course content client (proxy-ready or token-authenticated)
 */
export const courseApi = {
  async getTrades(token?: string): Promise<PaginatedResponse<Trade>> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await backendClient.get<PaginatedResponse<Trade>>('/api/v1/courses/trades/', { headers });
    return res.data;
  },

  async getModules(token?: string): Promise<PaginatedResponse<Module>> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await backendClient.get<PaginatedResponse<Module>>('/api/v1/courses/modules/', { headers });
    return res.data;
  },

  async getProcedures(params?: { difficulty?: string; search?: string }): Promise<PaginatedResponse<Procedure>> {
    const res = await apiClient.get<PaginatedResponse<Procedure>>('/api/courses/procedures', {
      params,
    });
    return res.data;
  },

  async getProcedure(codeOrId: string): Promise<Procedure> {
    const res = await apiClient.get<Procedure>(`/api/courses/procedures/${encodeURIComponent(codeOrId)}`);
    return res.data;
  },

  async getSteps(token?: string): Promise<PaginatedResponse<ProcedureStep>> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await backendClient.get<PaginatedResponse<ProcedureStep>>('/api/v1/courses/steps/', { headers });
    return res.data;
  },
};

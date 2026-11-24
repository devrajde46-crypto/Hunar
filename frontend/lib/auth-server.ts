import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosRequestConfig } from 'axios';
import { backendClient } from '@/lib/api';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
} from '@/lib/auth-cookies';

/**
 * Server-side helper to forward authenticated requests to Django backend.
 * Reads httpOnly access and refresh tokens from NextRequest cookies,
 * automatically performs refresh rotation if access token is expired,
 * and attaches any refreshed token cookies to the outgoing NextResponse.
 */
export async function forwardAuthenticatedRequest(
  request: NextRequest,
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<NextResponse> {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const makeCall = async (token: string) => {
    return backendClient.request({
      url: endpoint,
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // 1. Try with current access token
  if (accessToken) {
    try {
      const res = await makeCall(accessToken);
      return NextResponse.json(res.data, { status: res.status });
    } catch (err) {
      if (!axios.isAxiosError(err) || err.response?.status !== 401) {
        const status = (axios.isAxiosError(err) && err.response?.status) || 500;
        const data = (axios.isAxiosError(err) && err.response?.data) || { error: 'Backend error' };
        return NextResponse.json(data, { status });
      }
    }
  }

  // 2. Try refresh if refresh token is available
  if (refreshToken) {
    try {
      const refreshRes = await backendClient.post('/api/v1/auth/token/refresh/', {
        refresh: refreshToken,
      });

      const newAccess = refreshRes.data.access;
      const newRefresh = refreshRes.data.refresh;

      const res = await makeCall(newAccess);

      const response = NextResponse.json(res.data, { status: res.status });
      response.cookies.set(ACCESS_TOKEN_COOKIE, newAccess, ACCESS_COOKIE_OPTIONS);
      if (newRefresh) {
        response.cookies.set(REFRESH_TOKEN_COOKIE, newRefresh, REFRESH_COOKIE_OPTIONS);
      }
      return response;
    } catch {
      const response = NextResponse.json({ error: 'Session expired' }, { status: 401 });
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
      return response;
    }
  }

  return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
}

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { backendClient } from '@/lib/api';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
} from '@/lib/auth-cookies';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  // If no tokens at all, return unauthenticated
  if (!accessToken && !refreshToken) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  // Helper to fetch user with a specific access token
  const fetchUser = async (token: string) => {
    return backendClient.get('/api/v1/auth/me/', {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // 1. Try with existing access token if present
  if (accessToken) {
    try {
      const userRes = await fetchUser(accessToken);
      return NextResponse.json({ user: userRes.data });
    } catch (err) {
      // If access token expired (401), fall through to refresh
      if (!axios.isAxiosError(err) || err.response?.status !== 401) {
        return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 });
      }
    }
  }

  // 2. Attempt token refresh if refresh token is present
  if (refreshToken) {
    try {
      const refreshRes = await backendClient.post('/api/v1/auth/token/refresh/', {
        refresh: refreshToken,
      });

      const newAccess = refreshRes.data.access;
      const newRefresh = refreshRes.data.refresh;

      const userRes = await fetchUser(newAccess);

      const response = NextResponse.json({ user: userRes.data });
      response.cookies.set(ACCESS_TOKEN_COOKIE, newAccess, ACCESS_COOKIE_OPTIONS);
      if (newRefresh) {
        response.cookies.set(REFRESH_TOKEN_COOKIE, newRefresh, REFRESH_COOKIE_OPTIONS);
      }
      return response;
    } catch {
      // Refresh token invalid or blacklisted; clear cookies
      const response = NextResponse.json({ error: 'Session expired' }, { status: 401 });
      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete(REFRESH_TOKEN_COOKIE);
      return response;
    }
  }

  return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
}

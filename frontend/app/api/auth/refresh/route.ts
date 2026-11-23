import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { backendClient } from '@/lib/api';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
} from '@/lib/auth-cookies';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token available' }, { status: 401 });
  }

  try {
    const res = await backendClient.post('/api/v1/auth/token/refresh/', {
      refresh: refreshToken,
    });

    const newAccess = res.data.access;
    const newRefresh = res.data.refresh;

    const response = NextResponse.json({ success: true });
    response.cookies.set(ACCESS_TOKEN_COOKIE, newAccess, ACCESS_COOKIE_OPTIONS);
    if (newRefresh) {
      response.cookies.set(REFRESH_TOKEN_COOKIE, newRefresh, REFRESH_COOKIE_OPTIONS);
    }
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: 'Token refresh failed' },
      { status: axios.isAxiosError(error) ? error.response?.status || 401 : 401 }
    );
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
    return response;
  }
}

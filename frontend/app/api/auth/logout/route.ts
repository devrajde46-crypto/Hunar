import { NextRequest, NextResponse } from 'next/server';
import { backendClient } from '@/lib/api';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '@/lib/auth-cookies';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  // Call Django logout endpoint to blacklist refresh token
  if (refreshToken) {
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      await backendClient.post(
        '/api/v1/auth/logout/',
        { refresh: refreshToken },
        { headers }
      );
    } catch {
      // Continue clearing cookies even if backend call fails
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);

  return response;
}

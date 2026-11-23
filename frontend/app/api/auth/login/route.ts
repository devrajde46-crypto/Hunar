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
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const res = await backendClient.post('/api/v1/auth/login/', {
      username,
      password,
    });

    const { access, refresh, user } = res.data;

    const response = NextResponse.json({ user });
    response.cookies.set(ACCESS_TOKEN_COOKIE, access, ACCESS_COOKIE_OPTIONS);
    response.cookies.set(REFRESH_TOKEN_COOKIE, refresh, REFRESH_COOKIE_OPTIONS);

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data;
      const message =
        data?.detail ||
        (typeof data === 'object' && Object.values(data)[0]) ||
        'Invalid username or password.';
      return NextResponse.json(
        { error: typeof message === 'string' ? message : 'Invalid username or password.' },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { error: 'Unable to connect to authentication service.' },
      { status: 500 }
    );
  }
}

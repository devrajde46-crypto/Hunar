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
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      phone_number,
      trainee_id_number,
      institution_code,
      consent,
    } = body;

    // Basic required field validation
    if (!username || !email || !password || !institution_code) {
      return NextResponse.json(
        { error: 'Username, email, password, and institution code are required.' },
        { status: 400 }
      );
    }

    // Build payload ensuring role is never forwarded from client
    const registerPayload = {
      username: username.trim(),
      email: email.trim(),
      password,
      first_name: first_name?.trim() || '',
      last_name: last_name?.trim() || '',
      phone_number: phone_number?.trim() || '',
      trainee_id_number: trainee_id_number?.trim() || '',
      institution_code: institution_code.trim(),
      consent: {
        consent_version: consent?.consent_version || 'v1.0-2026',
        is_granted: consent?.is_granted ?? true,
      },
    };

    // 1. Register with Django backend
    await backendClient.post('/api/v1/auth/register/', registerPayload);

    // 2. Automatically log in the user upon successful registration
    try {
      const loginRes = await backendClient.post('/api/v1/auth/login/', {
        username: registerPayload.username,
        password: registerPayload.password,
      });

      const { access, refresh, user } = loginRes.data;
      const response = NextResponse.json({ user, success: true }, { status: 201 });
      response.cookies.set(ACCESS_TOKEN_COOKIE, access, ACCESS_COOKIE_OPTIONS);
      response.cookies.set(REFRESH_TOKEN_COOKIE, refresh, REFRESH_COOKIE_OPTIONS);
      return response;
    } catch {
      // If auto-login fails, still return success so user can log in manually
      return NextResponse.json(
        { success: true, message: 'Registration successful. Please log in.' },
        { status: 201 }
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Return a safe, generic error message to prevent email and user enumeration
      return NextResponse.json(
        { error: 'Unable to complete registration with the provided details. Please verify your information and password requirements.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Registration service currently unavailable.' },
      { status: 500 }
    );
  }
}

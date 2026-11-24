import { NextRequest } from 'next/server';
import { forwardAuthenticatedRequest } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get('difficulty');
  const search = searchParams.get('search');
  const page = searchParams.get('page');

  const params: Record<string, string> = {};
  if (difficulty && difficulty !== 'ALL') params.difficulty = difficulty;
  if (search) params.search = search;
  if (page) params.page = page;

  return forwardAuthenticatedRequest(request, '/api/v1/courses/procedures/', {
    method: 'GET',
    params,
  });
}

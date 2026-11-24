import { NextRequest } from 'next/server';
import { forwardAuthenticatedRequest } from '@/lib/auth-server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codeOrId: string }> }
) {
  const { codeOrId } = await params;
  return forwardAuthenticatedRequest(
    request,
    `/api/v1/courses/procedures/${encodeURIComponent(codeOrId)}/`,
    {
      method: 'GET',
    }
  );
}

import { NextRequest, NextResponse } from 'next/server';

import { BACKEND_URL } from '@/lib/api';

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request);
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request);
}

async function proxyRequest(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Extract the path from the URL: /api/proxy/prayers/today -> /prayers/today
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/proxy', '');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const config: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'DELETE') {
    const body = await request.json();
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BACKEND_URL}${path}`, config);
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
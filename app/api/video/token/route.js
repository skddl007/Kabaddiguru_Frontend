import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const raidId = searchParams.get('raid_id');
    if (!raidId) {
      return NextResponse.json({ error: 'raid_id is required' }, { status: 400 });
    }

    // Forward client IP headers so backend binds token correctly
    const xff = request.headers.get('x-forwarded-for');
    const xri = request.headers.get('x-real-ip');

    const resp = await fetch(`${API_BASE_URL}/dashboard/video-token?raid_id=${encodeURIComponent(raidId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(xff ? { 'x-forwarded-for': xff } : {}),
        ...(xri ? { 'x-real-ip': xri } : {}),
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: 'Failed to obtain token', details: text }, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Token endpoint error', message: e.message }, { status: 500 });
  }
}



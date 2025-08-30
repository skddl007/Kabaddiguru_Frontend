import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const raidId = searchParams.get('raid_id');
    if (!raidId) {
      return NextResponse.json({ error: 'raid_id is required' }, { status: 400 });
    }

    const resp = await fetch(`${API_BASE_URL}/dashboard/video-url?raid_id=${encodeURIComponent(raidId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: 'Failed to fetch video url', details: text }, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Video URL endpoint error', message: e.message }, { status: 500 });
  }
}



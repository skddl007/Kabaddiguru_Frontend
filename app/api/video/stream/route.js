import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const raidId = url.searchParams.get('raid_id');
    const token = url.searchParams.get('token');
    if (!raidId || !token) {
      return NextResponse.json({ error: 'raid_id and token are required' }, { status: 400 });
    }

    // New approach: create a server-side session on backend, and stream via that session endpoint
    const xff = request.headers.get('x-forwarded-for');
    const xri = request.headers.get('x-real-ip');
    const sessionResp = await fetch(`${API_BASE_URL}/dashboard/video-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(xff ? { 'x-forwarded-for': xff } : {}),
        ...(xri ? { 'x-real-ip': xri } : {}),
      },
      body: JSON.stringify({ raid_id: Number(raidId) }),
      cache: 'no-store'
    });
    if (!sessionResp.ok) {
      const text = await sessionResp.text();
      return NextResponse.json({ error: 'Failed to create video session', details: text }, { status: sessionResp.status });
    }
    const { sid } = await sessionResp.json();
    if (!sid) {
      return NextResponse.json({ error: 'Missing session id' }, { status: 500 });
    }

    // Step 2: fetch stream from backend session endpoint (keeps origin hidden and avoids token in URL)
    const reqHeaders = new Headers();
    const range = request.headers.get('range');
    if (range) reqHeaders.set('Range', range);
    const originFetch = await fetch(`${API_BASE_URL}/dashboard/video-stream-session?sid=${encodeURIComponent(sid)}`, {
      method: 'GET',
      headers: reqHeaders,
      cache: 'no-store'
    });

    if (!originFetch.ok && originFetch.status !== 206) {
      const text = await originFetch.text();
      return NextResponse.json({ error: 'Origin fetch failed', status: originFetch.status, details: text?.slice(0, 512) }, { status: originFetch.status || 502 });
    }

    const resHeaders = new Headers();
    const pass = ['content-length', 'content-range', 'accept-ranges', 'content-type', 'cache-control', 'pragma', 'expires'];
    pass.forEach((h) => {
      const v = originFetch.headers.get(h);
      if (v) resHeaders.set(h, v);
    });
    if (!resHeaders.get('content-type')) resHeaders.set('content-type', 'video/mp4');
    resHeaders.set('cache-control', 'no-store, no-cache, must-revalidate, private');

    return new NextResponse(originFetch.body, {
      status: originFetch.status,
      headers: resHeaders
    });
  } catch (e) {
    return NextResponse.json({ error: 'Proxy stream error', message: e.message }, { status: 500 });
  }
}



import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

const API_BASE_URL = (() => {
  const explicit = process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim();
  if (explicit) return explicit;
  if (process.env.NODE_ENV === 'development') return 'http://127.0.0.1:8000';
  return '';
})();

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || ''
    const endpoint = `/auth/chat-limit`
    const primaryUrl = `${API_BASE_URL}${endpoint}`

    let resp
    try {
      resp = await fetch(primaryUrl, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
        },
        cache: 'no-store',
      })
    } catch (e) {
      const isExplicit = Boolean(process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim())
      if (!isExplicit && API_BASE_URL.includes('127.0.0.1')) {
        const fallbackUrl = `http://localhost:8000${endpoint}`
        try {
          resp = await fetch(fallbackUrl, {
            method: 'GET',
            headers: {
              'Authorization': authHeader,
            },
            cache: 'no-store',
          })
        } catch (e2) {
          console.error('[chat-limit] fetch error primary and fallback failed', { primaryUrl, error1: String(e), fallbackUrl, error2: String(e2) })
          return NextResponse.json({ error: 'Proxy fetch failed', message: String(e2) }, { status: 502 })
        }
      } else {
        console.error('[chat-limit] fetch error', { url: primaryUrl, error: String(e) })
        return NextResponse.json({ error: 'Proxy fetch failed', message: String(e) }, { status: 502 })
      }
    }

    const contentType = resp.headers.get('content-type') || ''
    if (!resp.ok) {
      let body = undefined
      try {
        body = contentType.includes('application/json') ? await resp.json() : await resp.text()
      } catch {}
      return NextResponse.json(
        { error: 'Upstream error', status: resp.status, body },
        { status: resp.status }
      )
    }

    const data = await resp.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('[chat-limit] unexpected error', String(error))
    return NextResponse.json({ error: 'Proxy fetch failed', message: String(error) }, { status: 502 })
  }
}



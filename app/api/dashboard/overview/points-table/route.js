export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const season = searchParams.get('season') || '11'
    // Build candidate backend bases (with and without /api) from env vars
    const bases = [
      process.env.NEXT_PUBLIC_API_URL,
      process.env.NEXT_PUBLIC_API_URL_ALT,
      process.env.NEXT_PUBLIC_API_URL_ALT2,
      'http://localhost:8000'
    ].filter(Boolean).map(b => b.replace(/\/+$/, ''))
      .flatMap(b => [b.replace(/\/api$/, ''), b.endsWith('/api') ? b : `${b}/api`])
    const headers = {}
    const auth = request.headers.get('authorization')
    if (auth) headers['Authorization'] = auth

    const attempts = []
    for (const base of bases) {
      const url = `${base}/dashboard/overview/points-table?season=${encodeURIComponent(season)}`
      try {
        const res = await fetch(url, { method: 'GET', headers, cache: 'no-store' })
        const text = await res.text()
        if (res.ok) {
          try { return new Response(JSON.stringify(JSON.parse(text)), { status: res.status }) } catch { return new Response(text, { status: res.status }) }
        }
        attempts.push({ url, status: res.status, body: text })
      } catch (e) {
        attempts.push({ url, status: 'network_error', body: String(e) })
      }
    }
    return new Response(JSON.stringify({ error: 'Upstream error', attempts }), { status: 502 })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to proxy overview points table', detail: String(e) }), { status: 500 })
  }
}



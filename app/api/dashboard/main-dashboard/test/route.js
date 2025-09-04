export async function GET(request) {
  try {
    const backendBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const headers = {}
    const auth = request.headers.get('authorization')
    if (auth) headers['Authorization'] = auth

    const res = await fetch(`${backendBase}/dashboard/overview/test`, {
      method: 'GET',
      headers,
      cache: 'no-store'
    })
    const data = await res.json()
    return new Response(JSON.stringify(data), { status: res.status })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to test overview endpoint', detail: String(e) }), { status: 500 })
  }
}

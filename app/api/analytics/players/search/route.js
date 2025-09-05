import { NextResponse } from "next/server"

// Proxy GET /api/analytics/players/search to backend /analytics/players/search

export async function GET(request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_BASE_URL || "http://localhost:8000"
    const url = new URL(request.url)
    const qs = url.search || ""
    const upstream = `${baseUrl}/analytics/players/search${qs}`

    const res = await fetch(upstream, { method: "GET" })
    if (!res.ok) {
      return NextResponse.json({ success: false, error: `Upstream error ${res.status}` }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || "Internal error" }, { status: 500 })
  }
}



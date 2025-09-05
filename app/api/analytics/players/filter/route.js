import { NextResponse } from "next/server"

// Proxy POST /api/analytics/players/filter to backend /analytics/players/filter
// Ensures data is fetched from the database using the exact quoted column names in table "S_RBR"

export async function POST(request) {
  try {
    const payload = await request.json()

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_BASE_URL || "http://localhost:8000"
    const url = `${baseUrl}/analytics/players/filter`

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      return NextResponse.json({ success: false, error: `Upstream error ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ success: false, error: err?.message || "Internal error" }, { status: 500 })
  }
}



"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// items: array from /analytics/players/filter
// Render 4 cards in a row summarizing key stats
export default function PlayersSummaryCards({ items }) {
  const summary = useMemo(() => {
    const s = {
      totalEvents: 0,
      totalPoints: 0,
      successRate: 0,
      uniqueOpponents: 0
    }
    if (!Array.isArray(items) || items.length === 0) return s

    s.totalEvents = items.length
    s.totalPoints = items.reduce((acc, it) => acc + (Number(it?.points) || 0), 0)

    const successCount = items.filter(it => (it?.result || "").toLowerCase() === "successful").length
    s.successRate = s.totalEvents > 0 ? Math.round((successCount / s.totalEvents) * 100) : 0

    const opponents = new Set()
    for (const it of items) {
      if (it?.opponent_team) opponents.add(it.opponent_team)
    }
    s.uniqueOpponents = opponents.size

    return s
  }, [items])

  const cards = [
    { label: "Total Raids", value: summary.totalEvents, bg: "from-emerald-50 to-teal-50", text: "text-emerald-700" },
    { label: "Total Points", value: summary.totalPoints, bg: "from-indigo-50 to-violet-50", text: "text-indigo-700" },
    { label: "Success Rate", value: `${summary.successRate}%`, bg: "from-amber-50 to-orange-50", text: "text-amber-700" },
    { label: "Opponents Faced", value: summary.uniqueOpponents, bg: "from-sky-50 to-cyan-50", text: "text-sky-700" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className="border-0 shadow-md bg-gradient-to-br">
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm ${c.text}`}>{c.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${c.text}`}>{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}



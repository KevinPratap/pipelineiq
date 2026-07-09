"use client"

import type { DealWithActivities } from "@/types"

export function MetricsCards({ deals }: { deals: DealWithActivities[] }) {
  const totalValue = deals.reduce((s, d) => s + d.value, 0)
  const weightedForecast = deals
    .filter((d) => d.stage !== "CLOSED_LOST")
    .reduce((s, d) => s + d.value * (d.probability / 100), 0)
  const won = deals.filter((d) => d.stage === "CLOSED_WON").length
  const lost = deals.filter((d) => d.stage === "CLOSED_LOST").length
  const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0

  const cards = [
    { label: "Total Pipeline Value", value: `$${totalValue.toLocaleString()}`, sub: `${deals.length} deals` },
    { label: "Weighted Forecast", value: `$${Math.round(weightedForecast).toLocaleString()}`, sub: "Expected revenue" },
    { label: "Deal Count", value: deals.length.toString(), sub: "Active deals" },
    { label: "Win Rate", value: `${winRate}%`, sub: `${won} won / ${lost} lost` },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold">{card.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}

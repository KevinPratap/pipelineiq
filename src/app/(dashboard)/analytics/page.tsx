import { getDeals } from "@/lib/actions/deal"

export default async function AnalyticsPage() {
  const deals = await getDeals()

  const stageTotals: Record<string, number> = {}
  const stageCounts: Record<string, number> = {}
  const stages = ["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"]
  const labels: Record<string, string> = {
    LEAD: "Lead", QUALIFIED: "Qualified", PROPOSAL: "Proposal",
    NEGOTIATION: "Negotiation", CLOSED_WON: "Closed Won", CLOSED_LOST: "Closed Lost",
  }

  for (const s of stages) {
    stageTotals[s] = 0
    stageCounts[s] = 0
  }
  for (const d of deals) {
    stageTotals[d.stage] = (stageTotals[d.stage] || 0) + d.value
    stageCounts[d.stage] = (stageCounts[d.stage] || 0) + 1
  }

  const totalPipeline = deals.reduce((s, d) => s + d.value, 0)
  const weightedForecast = deals
    .filter((d) => d.stage !== "CLOSED_LOST")
    .reduce((s, d) => s + d.value * (d.probability / 100), 0)
  const won = stageCounts["CLOSED_WON"] || 0
  const lost = stageCounts["CLOSED_LOST"] || 0
  const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Pipeline performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Pipeline</p>
          <p className="text-2xl font-semibold">${totalPipeline.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Weighted Forecast</p>
          <p className="text-2xl font-semibold">${Math.round(weightedForecast).toLocaleString()}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Win Rate</p>
          <p className="text-2xl font-semibold">{winRate}%</p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-sm font-medium">Deal Value by Stage</h3>
        <div className="space-y-3">
          {stages.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <span className="w-24 text-sm text-muted-foreground">{labels[s]}</span>
              <div className="flex-1">
                <div className="h-4 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-foreground/20 transition-all"
                    style={{ width: `${(stageTotals[s] / Math.max(...Object.values(stageTotals))) * 100}%` }}
                  />
                </div>
              </div>
              <span className="w-24 text-right text-sm font-medium">${stageTotals[s].toLocaleString()}</span>
              <span className="w-12 text-right text-sm text-muted-foreground">{stageCounts[s]} deals</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-sm font-medium">Stage Conversion</h3>
        <div className="space-y-3">
          {stages.slice(0, -2).map((s, i) => {
            const current = stageCounts[s] || 0
            const next = stageCounts[stages[i + 1]] || 0
            const rate = current > 0 ? Math.round((next / current) * 100) : 0
            return (
              <div key={s} className="flex items-center gap-4">
                <span className="w-24 text-sm text-muted-foreground">{labels[s]} → {labels[stages[i + 1]]}</span>
                <span className="text-sm font-medium">{rate}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

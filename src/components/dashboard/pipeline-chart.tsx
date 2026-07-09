"use client"

import type { DealWithActivities } from "@/types"

const stages = ["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"]
const labels: Record<string, string> = {
  LEAD: "Lead", QUALIFIED: "Qualified", PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation", CLOSED_WON: "Closed Won", CLOSED_LOST: "Closed Lost",
}

export function PipelineChart({ deals }: { deals: DealWithActivities[] }) {
  const stageTotals: Record<string, number> = {}
  for (const s of stages) stageTotals[s] = 0
  for (const d of deals) stageTotals[d.stage] = (stageTotals[d.stage] || 0) + d.value
  const maxVal = Math.max(...Object.values(stageTotals), 1)

  return (
    <div className="rounded-lg border p-6">
      <h3 className="mb-4 text-sm font-medium">Pipeline Value by Stage</h3>
      <div className="space-y-3">
        {stages.map((stage) => (
          <div key={stage} className="flex items-center gap-4">
            <span className="w-24 text-sm text-muted-foreground">{labels[stage]}</span>
            <div className="flex-1">
              <div className="h-5 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-foreground/20 transition-all"
                  style={{ width: `${(stageTotals[stage] / maxVal) * 100}%` }}
                />
              </div>
            </div>
            <span className="w-28 text-right text-sm font-medium">
              ${stageTotals[stage].toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

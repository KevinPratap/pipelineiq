"use client"

import type { DealWithActivities } from "@/types"
import { computeDealHealth, computePipelineHealth, getPipelineCoachAlerts } from "@/lib/pipeline-insights"
import { AlertTriangle, TrendingUp, Activity, Target } from "lucide-react"

export function PipelineCoach({ deals }: { deals: DealWithActivities[] }) {
  const health = computePipelineHealth(deals)
  const alerts = getPipelineCoachAlerts(deals, 4)

  return (
    <div className="space-y-6">
      {/* Pipeline Health Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Healthy", value: health.healthy, color: "bg-green-500", icon: TrendingUp, sub: `${Math.round((health.healthy / Math.max(health.total, 1)) * 100)}% of pipeline` },
          { label: "Stalling", value: health.stalling, color: "bg-amber-500", icon: Activity, sub: "Needs attention" },
          { label: "At Risk", value: health.atRisk, color: "bg-red-500", icon: AlertTriangle, sub: "Immediate action" },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-semibold">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Coach Alerts */}
      {alerts.length > 0 && (
        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Pipeline Coach</h3>
          </div>
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <div key={i} className="rounded-md bg-amber-500/10 px-3 py-2 text-sm">
                {alert}
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && health.total > 0 && (
        <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
          Pipeline looks healthy. No coaching needed right now.
        </div>
      )}
    </div>
  )
}

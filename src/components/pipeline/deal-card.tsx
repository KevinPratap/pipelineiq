"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import type { DealWithActivities } from "@/types"
import { computeDealHealth } from "@/lib/pipeline-insights"

const priorityColors: Record<string, "default" | "secondary" | "destructive"> = {
  none: "secondary",
  low: "default",
  medium: "default",
  high: "destructive",
}

const healthColors: Record<string, string> = {
  healthy: "bg-green-500",
  stalling: "bg-amber-500",
  "at-risk": "bg-red-500",
}

export function DealCard({ deal, isDragOverlay }: { deal: DealWithActivities; isDragOverlay?: boolean }) {
  const router = useRouter()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
    disabled: isDragOverlay,
  })

  const health = computeDealHealth(deal)
  const showHealthDot = deal.stage !== "CLOSED_WON" && deal.stage !== "CLOSED_LOST"

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const handleClick = () => {
    if (!isDragging && !isDragOverlay) {
      router.push(`/deals/${deal.id}`)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`cursor-pointer rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md ${isDragOverlay ? "shadow-lg" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {showHealthDot && (
            <div
              className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${healthColors[health.level]}`}
              title={`Health: ${health.score}/100 — ${health.level}`}
            />
          )}
          <p className="truncate text-sm font-medium">{deal.title}</p>
        </div>
        {deal.priority !== "none" && (
          <Badge variant={priorityColors[deal.priority] || "secondary"} className="shrink-0 text-[10px]">
            {deal.priority}
          </Badge>
        )}
      </div>
      {deal.company && (
        <p className="mt-1 truncate text-xs text-muted-foreground">{deal.company}</p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-semibold">${deal.value.toLocaleString()}</span>
        <div className="flex items-center gap-2">
          {showHealthDot && (
            <span className="text-[10px] text-muted-foreground">{health.score}</span>
          )}
          {deal.stage !== "CLOSED_WON" && deal.stage !== "CLOSED_LOST" && (
            <span className="text-xs text-muted-foreground">{deal.probability}%</span>
          )}
        </div>
      </div>
      {health.warnings.length > 0 && (
        <p className="mt-1.5 truncate text-[10px] text-amber-600 dark:text-amber-400" title={health.warnings[0]}>
          {health.warnings[0]}
        </p>
      )}
    </div>
  )
}

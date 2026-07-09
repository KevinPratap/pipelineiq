"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import type { DealWithActivities } from "@/types"

const priorityColors: Record<string, "default" | "secondary" | "destructive"> = {
  none: "secondary",
  low: "default",
  medium: "default",
  high: "destructive",
}

export function DealCard({ deal, isDragOverlay }: { deal: DealWithActivities; isDragOverlay?: boolean }) {
  const router = useRouter()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
    disabled: isDragOverlay,
  })

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
        <p className="text-sm font-medium">{deal.title}</p>
        {deal.priority !== "none" && (
          <Badge variant={priorityColors[deal.priority] || "secondary"} className="shrink-0 text-[10px]">
            {deal.priority}
          </Badge>
        )}
      </div>
      {deal.company && (
        <p className="mt-1 text-xs text-muted-foreground">{deal.company}</p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-semibold">${deal.value.toLocaleString()}</span>
        {deal.stage !== "CLOSED_WON" && deal.stage !== "CLOSED_LOST" && (
          <span className="text-xs text-muted-foreground">{deal.probability}%</span>
        )}
      </div>
    </div>
  )
}

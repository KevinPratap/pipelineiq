"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { DealCard } from "./deal-card"
import type { DealWithActivities } from "@/types"

const stageAccents: Record<string, string> = {
  LEAD: "border-t-blue-500/40",
  QUALIFIED: "border-t-indigo-500/40",
  PROPOSAL: "border-t-violet-500/40",
  NEGOTIATION: "border-t-amber-500/40",
  CLOSED_WON: "border-t-green-500/40",
  CLOSED_LOST: "border-t-red-500/30",
}

const stageHeaders: Record<string, { bg: string; text: string; dot: string }> = {
  LEAD: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  QUALIFIED: { bg: "bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", dot: "bg-indigo-500" },
  PROPOSAL: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", dot: "bg-violet-500" },
  NEGOTIATION: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  CLOSED_WON: { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400", dot: "bg-green-500" },
  CLOSED_LOST: { bg: "bg-red-500/5", text: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
}

export function KanbanColumn({
  id,
  title,
  deals,
}: {
  id: string
  title: string
  deals: DealWithActivities[]
}) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const totalValue = deals.reduce((s, d) => s + d.value, 0)
  const header = stageHeaders[id] || { bg: "", text: "text-muted-foreground", dot: "bg-muted" }

  return (
    <div
      className={`flex min-w-[280px] flex-col rounded-lg border-t-2 bg-muted/30 ${
        stageAccents[id] || "border-t-transparent"
      } ${isOver ? "ring-2 ring-ring" : ""}`}
    >
      <div className={`flex items-center justify-between border-b px-4 py-3 ${header.bg}`}>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${header.dot}`} />
          <h3 className={`text-sm font-medium ${header.text}`}>{title}</h3>
          <span className="text-xs text-muted-foreground">{deals.length}</span>
        </div>
        <span className="text-xs text-muted-foreground">${totalValue.toLocaleString()}</span>
      </div>
      <div ref={setNodeRef} className="flex-1 space-y-2 p-3">
        <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
        {deals.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">Drop deals here</p>
        )}
      </div>
    </div>
  )
}

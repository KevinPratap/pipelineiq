"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { DealCard } from "./deal-card"
import type { DealWithActivities } from "@/types"

export function KanbanColumn({
  id,
  title,
  deals,
}: {
  id: string
  title: string
  deals: DealWithActivities[]
}) {
  const { setNodeRef } = useDroppable({ id })
  const totalValue = deals.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex min-w-[280px] flex-col rounded-lg border bg-muted/30">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{title}</h3>
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

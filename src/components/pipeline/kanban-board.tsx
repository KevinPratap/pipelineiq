"use client"

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { useState, useCallback } from "react"
import { KanbanColumn } from "./kanban-column"
import { DealCard } from "./deal-card"
import { DealCreateForm } from "./deal-create-form"
import { moveDeal } from "@/lib/actions/deal"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { DealWithActivities } from "@/types"

const stages = ["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"]
const stageLabels: Record<string, string> = {
  LEAD: "Lead", QUALIFIED: "Qualified", PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation", CLOSED_WON: "Closed Won", CLOSED_LOST: "Closed Lost",
}

export function KanbanBoard({ initialDeals }: { initialDeals: DealWithActivities[] }) {
  const [deals, setDeals] = useState(initialDeals)
  const [activeDeal, setActiveDeal] = useState<DealWithActivities | null>(null)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [exitReason, setExitReason] = useState("")
  const [pendingLostMove, setPendingLostMove] = useState<{ dealId: string; stage: string } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const filtered = deals.filter(
    (d) => d.title.toLowerCase().includes(search.toLowerCase()) || d.company?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const deal = deals.find((d) => d.id === event.active.id)
    if (deal) setActiveDeal(deal)
  }, [deals])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveDeal(null)
    const { active, over } = event
    if (!over) return

    const dealId = active.id as string
    const overId = over.id as string

    let targetStage = stages.find((s) => overId === s)
    if (!targetStage) {
      const overDeal = deals.find((d) => d.id === overId)
      if (overDeal) targetStage = overDeal.stage
    }
    if (!targetStage) return

    const draggedDeal = deals.find((d) => d.id === dealId)
    if (!draggedDeal || draggedDeal.stage === targetStage) return

    // If moving to CLOSED_LOST, show exit reason dialog first
    if (targetStage === "CLOSED_LOST") {
      setPendingLostMove({ dealId, stage: "CLOSED_LOST" })
      setExitReason("")
      return
    }

    // Optimistic update
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: targetStage as any } : d))
    )

    await moveDeal(dealId, targetStage)
  }, [deals])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Deal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Deal</DialogTitle>
            </DialogHeader>
            <DealCreateForm onSuccess={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage}
              id={stage}
              title={stageLabels[stage]}
              deals={filtered.filter((d) => d.stage === stage)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeDeal ? <DealCard deal={activeDeal} isDragOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Lost Deal Reason Dialog */}
      <Dialog open={!!pendingLostMove} onOpenChange={(o) => { if (!o) setPendingLostMove(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Why was this deal lost?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Help your team understand why deals don't close.</p>
            <select
              value={exitReason}
              onChange={(e) => setExitReason(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select a reason...</option>
              <option value="price">Price too high</option>
              <option value="competition">Lost to competitor</option>
              <option value="timing">Bad timing</option>
              <option value="budget">No budget</option>
              <option value="product">Product fit</option>
              <option value="other">Other</option>
            </select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPendingLostMove(null)}>Cancel</Button>
              <Button
                disabled={!exitReason}
                onClick={async () => {
                  if (!pendingLostMove) return
                  setDeals((prev) =>
                    prev.map((d) => (d.id === pendingLostMove.dealId ? { ...d, stage: "CLOSED_LOST" as any } : d))
                  )
                  await moveDeal(pendingLostMove.dealId, "CLOSED_LOST", exitReason || undefined)
                  setPendingLostMove(null)
                }}
              >
                Mark as Lost
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { getDeals } from "@/lib/actions/deal"
import { KanbanBoard } from "@/components/pipeline/kanban-board"

export default async function PipelinePage() {
  const deals = await getDeals()

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Pipeline</h1>
        <p className="text-sm text-muted-foreground">Drag deals between stages to update</p>
      </div>
      <KanbanBoard initialDeals={deals} />
    </div>
  )
}

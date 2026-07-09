import { getDeals } from "@/lib/actions/deal"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { PipelineChart } from "@/components/dashboard/pipeline-chart"

export default async function DashboardPage() {
  const deals = await getDeals()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your pipeline at a glance</p>
      </div>
      <MetricsCards deals={deals} />
      <PipelineChart deals={deals} />
    </div>
  )
}

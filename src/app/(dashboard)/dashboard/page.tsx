import { getDeals } from "@/lib/actions/deal"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { PipelineChart } from "@/components/dashboard/pipeline-chart"
import Link from "next/link"

const stageLabels: Record<string, string> = {
  LEAD: "Lead", QUALIFIED: "Qualified", PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation", CLOSED_WON: "Closed Won", CLOSED_LOST: "Closed Lost",
}

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

      <div className="rounded-lg border">
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-medium">Recent Deals</h3>
        </div>
        {deals.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No deals yet. Create one from the Pipeline view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Deal</th>
                  <th className="px-4 py-2 font-medium">Stage</th>
                  <th className="px-4 py-2 font-medium">Value</th>
                  <th className="px-4 py-2 font-medium">Company</th>
                  <th className="px-4 py-2 font-medium">Probability</th>
                </tr>
              </thead>
              <tbody>
                {deals.slice(0, 10).map((deal) => (
                  <tr key={deal.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-2.5">
                      <Link href={`/deals/${deal.id}`} className="font-medium hover:underline">
                        {deal.title}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{stageLabels[deal.stage] || deal.stage}</td>
                    <td className="px-4 py-2.5">${deal.value.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{deal.company || "—"}</td>
                    <td className="px-4 py-2.5">{deal.probability}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

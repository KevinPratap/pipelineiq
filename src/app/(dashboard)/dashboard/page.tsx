import { getDeals } from "@/lib/actions/deal"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { PipelineChart } from "@/components/dashboard/pipeline-chart"
import { PipelineCoach } from "@/components/dashboard/pipeline-coach"
import { DashboardOnboarding } from "@/components/dashboard/dashboard-onboarding"
import { Phone, Mail, Calendar, Building, Target } from "lucide-react"
import Link from "next/link"

const stageLabels: Record<string, string> = {
  LEAD: "Lead", QUALIFIED: "Qualified", PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation", CLOSED_WON: "Closed Won", CLOSED_LOST: "Closed Lost",
}

const activityIcons: Record<string, any> = {
  CALL: Phone, EMAIL: Mail, MEETING: Calendar, NOTE: Building, TASK: Target,
}

export default async function DashboardPage() {
  const session = await auth()
  const deals = await getDeals()

  // Show onboarding if no deals exist
  if (deals.length === 0) {
    return <DashboardOnboarding />
  }

  // Recent activities across all deals
  const recentActivities = await prisma.activity.findMany({
    where: { userId: session?.user?.id },
    include: { deal: { select: { title: true, id: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  })

  // Forecast calculation
  const bestCase = deals.reduce((s, d) => s + d.value, 0)
  const expected = deals
    .filter((d) => d.stage !== "CLOSED_LOST")
    .reduce((s, d) => s + d.value * (d.probability / 100), 0)
  const worstCase = deals
    .filter((d) => d.stage === "CLOSED_WON")
    .reduce((s, d) => s + d.value, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your pipeline at a glance</p>
      </div>

      <MetricsCards deals={deals} />

      {/* Forecast Range */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-3 text-sm font-medium">Revenue Forecast Range</h3>
        <div className="flex items-end gap-6">
          <div>
            <p className="text-xs text-muted-foreground">Best case</p>
            <p className="text-xl font-semibold text-green-600 dark:text-green-400">
              ${bestCase.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 self-center">
            <div className="relative h-3 rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-foreground/20"
                style={{ width: `${(expected / Math.max(bestCase, 1)) * 100}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-foreground/10"
                style={{ width: `${(bestCase / Math.max(bestCase, 1)) * 100}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>Worst: ${worstCase.toLocaleString()}</span>
              <span>Expected: ${Math.round(expected).toLocaleString()}</span>
              <span>Best: ${bestCase.toLocaleString()}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Expected</p>
            <p className="text-xl font-semibold">${Math.round(expected).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      {recentActivities.length > 0 && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-sm font-medium">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map((a) => {
              const Icon = activityIcons[a.type] || Building
              return (
                <div key={a.id} className="flex gap-3">
                  <div className="mt-0.5 rounded-full border p-1.5">
                    <Icon className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{a.type}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm truncate">
                      <Link href={`/deals/${a.deal.id}`} className="font-medium hover:underline">
                        {a.deal.title}
                      </Link>
                      {a.subject && <> — {a.subject}</>}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <PipelineCoach deals={deals} />
      <PipelineChart deals={deals} />

      <div className="rounded-lg border">
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-medium">Recent Deals</h3>
        </div>
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
      </div>
    </div>
  )
}

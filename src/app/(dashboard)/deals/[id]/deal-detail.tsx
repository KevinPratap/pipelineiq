"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Phone, Mail, Building, Calendar, DollarSign, Target } from "lucide-react"

const stageLabels: Record<string, string> = {
  LEAD: "Lead", QUALIFIED: "Qualified", PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation", CLOSED_WON: "Closed Won", CLOSED_LOST: "Closed Lost",
}

const activityIcons: Record<string, any> = {
  CALL: Phone, EMAIL: Mail, MEETING: Calendar, NOTE: Building, TASK: Target,
}

export function DealDetail({ deal }: { deal: any }) {
  const router = useRouter()

  return (
    <div className="max-w-3xl space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{deal.title}</h1>
          {deal.company && <p className="text-muted-foreground">{deal.company}</p>}
        </div>
        <Badge variant={deal.stage === "CLOSED_WON" ? "default" : "secondary"}>
          {stageLabels[deal.stage] || deal.stage}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Value</p>
          <p className="text-xl font-semibold">${deal.value.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Probability</p>
          <p className="text-xl font-semibold">{deal.probability}%</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Priority</p>
          <p className="text-xl font-semibold capitalize">{deal.priority || "none"}</p>
        </div>
      </div>

      {deal.contactName && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-medium">Contact</h3>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Name:</span> {deal.contactName}</p>
            {deal.contactEmail && <p><span className="text-muted-foreground">Email:</span> {deal.contactEmail}</p>}
            {deal.closeDate && (
              <p><span className="text-muted-foreground">Close date:</span> {new Date(deal.closeDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      )}

      {deal.notes && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-medium">Notes</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{deal.notes}</p>
        </div>
      )}

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-sm font-medium">Activity Timeline</h3>
        {deal.activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {deal.activities.map((activity: any) => {
              const Icon = activityIcons[activity.type] || Building
              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-0.5 rounded-full border p-1.5">
                    <Icon className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{activity.type}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {activity.subject && (
                      <p className="text-sm font-medium">{activity.subject}</p>
                    )}
                    {activity.content && (
                      <p className="text-sm text-muted-foreground">{activity.content}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

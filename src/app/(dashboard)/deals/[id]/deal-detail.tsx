"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Phone, Mail, Calendar, Building, Target, Plus } from "lucide-react"
import { useState } from "react"
import { updateDeal } from "@/lib/actions/deal"
import { createActivity } from "@/lib/actions/activity"
import { deleteDeal } from "@/lib/actions/deal"
import { toast } from "sonner"

const stageLabels: Record<string, string> = {
  LEAD: "Lead", QUALIFIED: "Qualified", PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation", CLOSED_WON: "Closed Won", CLOSED_LOST: "Closed Lost",
}

const activityIcons: Record<string, any> = {
  CALL: Phone, EMAIL: Mail, MEETING: Calendar, NOTE: Building, TASK: Target,
}

export function DealDetail({ deal }: { deal: any }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(deal.title)
  const [value, setValue] = useState(deal.value.toString())
  const [company, setCompany] = useState(deal.company || "")
  const [contactName, setContactName] = useState(deal.contactName || "")
  const [notes, setNotes] = useState(deal.notes || "")
  const [activityType, setActivityType] = useState("NOTE")
  const [activitySubject, setActivitySubject] = useState("")
  const [activityContent, setActivityContent] = useState("")

  const handleSave = async () => {
    const result = await updateDeal(deal.id, { title, value: parseFloat(value), company, contactName, notes })
    if (result.success) {
      toast.success("Deal updated")
      setEditing(false)
      router.refresh()
    }
  }

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData()
    form.set("type", activityType)
    form.set("subject", activitySubject)
    form.set("content", activityContent)
    const result = await createActivity(deal.id, form)
    if (result.success) {
      toast.success("Activity logged")
      setActivitySubject("")
      setActivityContent("")
      router.refresh()
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="flex items-start justify-between">
        <div className="flex-1">
          {editing ? (
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xl font-semibold" />
          ) : (
            <h1 className="text-2xl font-semibold">{deal.title}</h1>
          )}
          {editing ? (
            <Input value={company} onChange={(e) => setCompany(e.target.value)} className="mt-2" placeholder="Company" />
          ) : (
            deal.company && <p className="text-muted-foreground">{deal.company}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={deal.stage === "CLOSED_WON" ? "default" : "secondary"}>
            {stageLabels[deal.stage] || deal.stage}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => editing ? handleSave() : setEditing(true)}>
            {editing ? "Save" : "Edit"}
          </Button>
          {editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={async () => {
              if (confirm("Delete this deal? This cannot be undone.")) {
                await deleteDeal(deal.id)
                toast.success("Deal deleted")
                router.push("/pipeline")
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">Value</p>
          {editing ? (
            <Input value={value} onChange={(e) => setValue(e.target.value)} type="number" className="mt-1" />
          ) : (
            <p className="text-xl font-semibold">${deal.value.toLocaleString()}</p>
          )}
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

      {deal.contactName && !editing && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-medium">Contact</h3>
          <div className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Name:</span> {deal.contactName}</p>
            {deal.contactEmail && <p><span className="text-muted-foreground">Email:</span> {deal.contactEmail}</p>}
            {deal.closeDate && <p><span className="text-muted-foreground">Close date:</span> {new Date(deal.closeDate).toLocaleDateString()}</p>}
          </div>
        </div>
      )}

      {editing && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-medium">Contact</h3>
          <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Contact name" className="mb-2" />
          <p className="text-sm text-muted-foreground">{deal.contactEmail || "No email"}</p>
        </div>
      )}

      {editing ? (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-medium">Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Add notes..."
          />
        </div>
      ) : deal.notes && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-medium">Notes</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{deal.notes}</p>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-4 text-sm font-medium">Activity Timeline</h3>

        {/* Add Activity Form */}
        <form onSubmit={handleAddActivity} className="mb-6 space-y-3 rounded-lg bg-muted/30 p-4">
          <div className="flex gap-2">
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="flex h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="NOTE">Note</option>
              <option value="CALL">Call</option>
              <option value="EMAIL">Email</option>
              <option value="MEETING">Meeting</option>
              <option value="TASK">Task</option>
            </select>
            <Input
              placeholder="Subject"
              value={activitySubject}
              onChange={(e) => setActivitySubject(e.target.value)}
              className="flex-1"
            />
          </div>
          <textarea
            placeholder="Details..."
            value={activityContent}
            onChange={(e) => setActivityContent(e.target.value)}
            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <Button type="submit" size="sm">
            <Plus className="mr-1 h-3 w-3" /> Log activity
          </Button>
        </form>

        {/* Activity List */}
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
                    {activity.subject && <p className="text-sm font-medium">{activity.subject}</p>}
                    {activity.content && <p className="text-sm text-muted-foreground">{activity.content}</p>}
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

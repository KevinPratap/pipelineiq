"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createDeal } from "@/lib/actions/deal"
import { toast } from "sonner"

export function DealCreateForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()

  return (
    <form
      action={async (formData) => {
        const result = await createDeal(formData)
        if (result.error) {
          toast.error(result.error)
        } else {
          toast.success("Deal created")
          onSuccess?.()
          router.refresh()
        }
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="title">Title</label>
        <Input id="title" name="title" placeholder="Deal name" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="value">Value ($)</label>
        <Input id="value" name="value" type="number" min="0" placeholder="50000" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="stage">Stage</label>
        <select
          id="stage"
          name="stage"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          defaultValue="LEAD"
        >
          <option value="LEAD">Lead</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="PROPOSAL">Proposal</option>
          <option value="NEGOTIATION">Negotiation</option>
          <option value="CLOSED_WON">Closed Won</option>
          <option value="CLOSED_LOST">Closed Lost</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="company">Company</label>
        <Input id="company" name="company" placeholder="Company name" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="contactName">Contact Name</label>
        <Input id="contactName" name="contactName" placeholder="Contact name" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="closeDate">Close Date</label>
        <Input id="closeDate" name="closeDate" type="date" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          defaultValue="none"
        >
          <option value="none">None</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <Button type="submit" className="w-full">Create Deal</Button>
    </form>
  )
}

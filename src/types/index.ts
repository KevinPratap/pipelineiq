export type Stage = "LEAD" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST"

export type ActivityType = "CALL" | "EMAIL" | "MEETING" | "NOTE" | "TASK"

export interface DealWithActivities {
  id: string
  title: string
  value: number
  currency: string
  stage: Stage
  probability: number
  closeDate: Date | null
  company: string | null
  contactName: string | null
  contactEmail: string | null
  contactPhone: string | null
  notes: string | null
  priority: string
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  pipelineId: string
  userId: string
  activities: ActivityWithUser[]
}

export interface ActivityWithUser {
  id: string
  type: ActivityType
  subject: string
  content: string | null
  dueDate: Date | null
  completed: boolean
  createdAt: Date
  updatedAt: Date
  dealId: string
  userId: string
  user?: { name: string | null }
}

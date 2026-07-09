export interface DealActivity {
  id: string
  type: string
  subject: string | null
  content: string | null
  createdAt: Date
  updatedAt: Date
  dealId: string
  userId: string
  user?: { name: string | null }
}

export interface DealWithActivities {
  id: string
  title: string
  value: number
  stage: "LEAD" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST"
  company: string | null
  contactName: string | null
  contactEmail: string | null
  closeDate: Date | null
  priority: string
  probability: number
  notes: string | null
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  userId: string
  pipelineId: string
  activities: DealActivity[]
  health?: DealHealth
  stageExitReason?: string | null
}

export interface DealHealth {
  score: number
  level: "healthy" | "stalling" | "at-risk"
  warnings: string[]
}

export type Stage = "LEAD" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST"
export type ActivityType = "CALL" | "EMAIL" | "MEETING" | "NOTE" | "TASK"

export const stageLabels: Record<Stage, string> = {
  LEAD: "Lead",
  QUALIFIED: "Qualified",
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation",
  CLOSED_WON: "Closed Won",
  CLOSED_LOST: "Closed Lost",
}

// Expected days per stage (baseline averages)
const expectedStageDays: Record<string, number> = {
  LEAD: 7,
  QUALIFIED: 10,
  PROPOSAL: 14,
  NEGOTIATION: 10,
  CLOSED_WON: 0,
  CLOSED_LOST: 0,
}

/**
 * Compute a pipeline health score for a single deal (0-100).
 * Factors: days in current stage vs expected, activity frequency,
 * close date proximity, probability trajectory.
 */
export function computeDealHealth(deal: {
  stage: string
  probability: number
  closeDate?: Date | null
  createdAt: Date
  updatedAt: Date
  activities?: { createdAt: Date }[]
}): DealHealth {
  const warnings: string[] = []
  let score = 100

  // If won or lost, no health score needed
  if (deal.stage === "CLOSED_WON") return { score: 100, level: "healthy", warnings: [] }
  if (deal.stage === "CLOSED_LOST") return { score: 0, level: "at-risk", warnings: ["Deal was lost"] }

  // Days in current stage
  const daysInStage = Math.round((Date.now() - new Date(deal.updatedAt).getTime()) / 86400000)
  const expected = expectedStageDays[deal.stage] || 7

  if (daysInStage > expected * 1.5) {
    const excess = daysInStage - expected
    score -= Math.min(40, excess * 3)
    warnings.push(`Stuck in ${deal.stage} for ${daysInStage} days (expected ~${expected})`)
  }

  // Activity recency
  const activities = deal.activities || []
  const recentActivities = activities.filter(
    (a) => Date.now() - new Date(a.createdAt).getTime() < 7 * 86400000
  ).length

  if (recentActivities === 0) {
    score -= 20
    warnings.push("No activity logged this week")
  } else if (recentActivities < 2) {
    score -= 10
  }

  // Close date urgency
  if (deal.closeDate) {
    const daysUntilClose = Math.round((new Date(deal.closeDate).getTime() - Date.now()) / 86400000)
    if (daysUntilClose < 0) {
      score -= 15
      warnings.push(`Close date was ${Math.abs(daysUntilClose)} days ago`)
    } else if (daysUntilClose <= 3) {
      score -= 5
      warnings.push(`Close date is in ${daysUntilClose} days`)
    }
  }

  // Probability health
  if (deal.probability <= 10 && daysInStage > 5) {
    score -= 10
    warnings.push("Low probability for an extended period")
  }

  score = Math.max(0, Math.min(100, score))

  return {
    score,
    level: score >= 70 ? "healthy" : score >= 40 ? "stalling" : "at-risk",
    warnings,
  }
}

/**
 * Compute pipeline health summary for all deals.
 */
export function computePipelineHealth(deals: DealWithActivities[]) {
  const healthy = deals.filter((d) => {
    const h = computeDealHealth(d)
    return h.level === "healthy"
  }).length

  const stalling = deals.filter((d) => {
    const h = computeDealHealth(d)
    return h.level === "stalling"
  }).length

  const atRisk = deals.filter((d) => {
    const h = computeDealHealth(d)
    return h.level === "at-risk"
  }).length

  const allWarnings = deals.flatMap((d) => computeDealHealth(d).warnings)

  return { healthy, stalling, atRisk, total: deals.length, warnings: allWarnings }
}

/**
 * Get top coachable warnings (most impactful first).
 */
export function getPipelineCoachAlerts(deals: DealWithActivities[], maxAlerts = 5): string[] {
  const allAlerts = deals
    .map((d) => ({
      title: d.title,
      health: computeDealHealth(d),
      value: d.value,
    }))
    .filter((d) => d.health.warnings.length > 0)
    .sort((a, b) => b.health.score - a.health.score)
    .slice(0, maxAlerts)
    .map((d) => `**${d.title}** ($${d.value.toLocaleString()}): ${d.health.warnings[0]}`)

  return allAlerts
}

/**
 * Compute deal velocity (avg days per stage) from deals data.
 */
export function computeStageVelocity(deals: DealWithActivities[]) {
  // When a deal is in a stage, track days-in-stage (from updatedAt)
  // For closed deals, this is approximated from the difference between
  // deal creation and current time — a true velocity tracker would need
  // stage change history logs.
  const stageMap: Record<string, number[]> = {}

  for (const d of deals) {
    if (d.stage === "CLOSED_WON" || d.stage === "CLOSED_LOST") continue
    const days = Math.round((Date.now() - new Date(d.updatedAt).getTime()) / 86400000)
    if (!stageMap[d.stage]) stageMap[d.stage] = []
    stageMap[d.stage].push(days)
  }

  const result: Record<string, { avg: number; max: number; count: number }> = {}
  for (const [stage, days] of Object.entries(stageMap)) {
    result[stage] = {
      avg: Math.round(days.reduce((a, b) => a + b, 0) / days.length),
      max: Math.max(...days),
      count: days.length,
    }
  }

  return result
}

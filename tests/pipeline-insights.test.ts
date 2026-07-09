import { describe, it, expect } from "vitest"
import { computeDealHealth, computePipelineHealth, computeStageVelocity } from "@/lib/pipeline-insights"

const baseDeal = {
  id: "1",
  title: "Test Deal",
  value: 50000,
  stage: "LEAD" as const,
  company: "Test Corp",
  contactName: null,
  contactEmail: null,
  closeDate: null,
  priority: "none",
  probability: 10,
  notes: null,
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: "user1",
  pipelineId: "pipe1",
  activities: [] as { createdAt: Date }[],
}

describe("computeDealHealth", () => {
  it("returns healthy for a fresh deal with activity", () => {
    const result = computeDealHealth({
      ...baseDeal,
      updatedAt: new Date(),
      activities: [{ createdAt: new Date() }, { createdAt: new Date() }],
    })
    expect(result.score).toBeGreaterThanOrEqual(70)
    expect(result.level).toBe("healthy")
    expect(result.warnings).toHaveLength(0)
  })

  it("returns at-risk for a lost deal", () => {
    const result = computeDealHealth({
      ...baseDeal,
      stage: "CLOSED_LOST",
    })
    expect(result.score).toBe(0)
    expect(result.level).toBe("at-risk")
    expect(result.warnings).toContain("Deal was lost")
  })

  it("flags deals stuck in stage too long", () => {
    const oldDate = new Date(Date.now() - 20 * 86400000) // 20 days ago
    const result = computeDealHealth({
      ...baseDeal,
      updatedAt: oldDate,
      stageEnteredAt: oldDate,
      activities: [],
    })
    expect(result.score).toBeLessThan(70)
    expect(result.warnings.some((w) => w.includes("Stuck in"))).toBe(true)
  })

  it("flags no activity this week", () => {
    const oldActivity = new Date(Date.now() - 10 * 86400000) // 10 days ago
    const result = computeDealHealth({
      ...baseDeal,
      updatedAt: new Date(),
      stageEnteredAt: new Date(Date.now() - 2 * 86400000),
      activities: [{ createdAt: oldActivity }],
    })
    expect(result.warnings.some((w) => w.includes("No activity"))).toBe(true)
  })

  it("flags past close date", () => {
    const pastClose = new Date(Date.now() - 5 * 86400000)
    const result = computeDealHealth({
      ...baseDeal,
      closeDate: pastClose,
      activities: [{ createdAt: new Date() }],
    })
    expect(result.warnings.some((w) => w.includes("Close date was"))).toBe(true)
  })

  it("returns 100 for closed won", () => {
    const result = computeDealHealth({
      ...baseDeal,
      stage: "CLOSED_WON",
    })
    expect(result.score).toBe(100)
    expect(result.level).toBe("healthy")
  })
})

describe("computePipelineHealth", () => {
  it("summarizes health across deals", () => {
    const result = computePipelineHealth([
      { ...baseDeal, stage: "CLOSED_WON", activities: [] },
      { ...baseDeal, stage: "LEAD", updatedAt: new Date(Date.now() - 20 * 86400000), activities: [] },
      { ...baseDeal, stage: "QUALIFIED", updatedAt: new Date(), activities: [{ createdAt: new Date() }] },
    ])
    expect(result.total).toBe(3)
    expect(result.healthy + result.stalling + result.atRisk).toBe(3)
    expect(result.warnings.length).toBeGreaterThan(0)
  })
})

describe("computeStageVelocity", () => {
  it("computes avg days per stage", () => {
    const result = computeStageVelocity([
      { ...baseDeal, stage: "LEAD", updatedAt: new Date(Date.now() - 5 * 86400000) },
      { ...baseDeal, stage: "LEAD", updatedAt: new Date(Date.now() - 3 * 86400000), title: "Deal 2" },
      { ...baseDeal, stage: "QUALIFIED", updatedAt: new Date(Date.now() - 10 * 86400000), title: "Deal 3" },
    ])
    expect(result.LEAD).toBeDefined()
    expect(result.LEAD.count).toBe(2)
    expect(result.LEAD.avg).toBeGreaterThan(0)
    expect(result.QUALIFIED).toBeDefined()
    expect(result.QUALIFIED.count).toBe(1)
  })

  it("skips closed deals", () => {
    const result = computeStageVelocity([
      { ...baseDeal, stage: "CLOSED_WON", updatedAt: new Date() },
      { ...baseDeal, stage: "CLOSED_LOST", updatedAt: new Date() },
    ])
    expect(Object.keys(result)).toHaveLength(0)
  })
})

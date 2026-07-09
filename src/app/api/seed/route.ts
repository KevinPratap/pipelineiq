import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    // Clean existing data
    await prisma.activity.deleteMany()
    await prisma.deal.deleteMany()
    await prisma.pipeline.deleteMany()
    await prisma.user.deleteMany()

    // Create demo user
    const hashed = await bcrypt.hash("demo1234", 12)
    const user = await prisma.user.create({
      data: { name: "Demo User", email: "demo@pipelineiq.dev", password: hashed, role: "admin" },
    })

    // Create pipeline
    const pipeline = await prisma.pipeline.create({
      data: { name: "Sales Pipeline", stages: "LEAD,QUALIFIED,PROPOSAL,NEGOTIATION,CLOSED_WON,CLOSED_LOST", userId: user.id },
    })

    // Create sample deals
    const deals = [
      { title: "Acme Corp SaaS Deal", value: 50000, stage: "LEAD" as const, company: "Acme Corp", contactName: "John Smith", probability: 10 },
      { title: "TechStart Pro Plan", value: 25000, stage: "LEAD" as const, company: "TechStart Inc", contactName: "Sarah Chen", probability: 10 },
      { title: "GlobalRetail Migration", value: 120000, stage: "QUALIFIED" as const, company: "GlobalRetail", contactName: "Mike Brown", probability: 25 },
      { title: "DataFlow Analytics", value: 75000, stage: "PROPOSAL" as const, company: "DataFlow", contactName: "Lisa Wang", probability: 50 },
      { title: "CloudBase Enterprise", value: 200000, stage: "NEGOTIATION" as const, company: "CloudBase", contactName: "Tom Wilson", probability: 75 },
      { title: "StartupHub Basic", value: 15000, stage: "CLOSED_WON" as const, company: "StartupHub", contactName: "Alex Kim", probability: 100 },
      { title: "LegacyCorp Upgrade", value: 30000, stage: "CLOSED_LOST" as const, company: "LegacyCorp", contactName: "Jane Doe", probability: 0 },
    ]

    for (const deal of deals) {
      await prisma.deal.create({
        data: { ...deal, userId: user.id, pipelineId: pipeline.id },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded with demo data",
      credentials: { email: "demo@pipelineiq.dev", password: "demo1234" },
      deals: deals.length,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Seed failed" }, { status: 500 })
  }
}

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  await prisma.activity.deleteMany()
  await prisma.deal.deleteMany()
  await prisma.pipeline.deleteMany()
  await prisma.user.deleteMany()

  const hashed = await bcrypt.hash("demo1234", 12)
  const user = await prisma.user.create({
    data: { name: "Demo User", email: "demo@pipelineiq.dev", password: hashed, role: "admin" },
  })

  const pipeline = await prisma.pipeline.create({
    data: { name: "Sales Pipeline", stages: "LEAD,QUALIFIED,PROPOSAL,NEGOTIATION,CLOSED_WON,CLOSED_LOST", userId: user.id },
  })

  const deals = [
    { title: "Acme Corp SaaS Deal", value: 50000, stage: "LEAD" as const, company: "Acme Corp", probability: 10 },
    { title: "TechStart Pro Plan", value: 25000, stage: "LEAD" as const, company: "TechStart Inc", probability: 10 },
    { title: "GlobalRetail Migration", value: 120000, stage: "QUALIFIED" as const, company: "GlobalRetail", probability: 25 },
    { title: "DataFlow Analytics", value: 75000, stage: "PROPOSAL" as const, company: "DataFlow", probability: 50 },
    { title: "CloudBase Enterprise", value: 200000, stage: "NEGOTIATION" as const, company: "CloudBase", probability: 75 },
    { title: "StartupHub Basic", value: 15000, stage: "CLOSED_WON" as const, company: "StartupHub", probability: 100 },
    { title: "LegacyCorp Upgrade", value: 30000, stage: "CLOSED_LOST" as const, company: "LegacyCorp", probability: 0 },
  ]

  for (const deal of deals) {
    await prisma.deal.create({
      data: { ...deal, userId: user.id, pipelineId: pipeline.id },
    })
  }

  console.log("Seed completed!")
  console.log(`  Demo user: demo@pipelineiq.dev / demo1234`)
  console.log(`  Deals created: ${deals.length}`)
}

main().catch(console.error).finally(() => prisma.$disconnect())

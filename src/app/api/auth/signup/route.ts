import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

const sampleDeals = [
  { title: "Acme Corp SaaS Deal", value: 50000, stage: "LEAD", company: "Acme Corp", contactName: "John Smith", probability: 10 },
  { title: "TechStart Pro Plan", value: 25000, stage: "LEAD", company: "TechStart Inc", contactName: "Sarah Chen", probability: 10 },
  { title: "GlobalRetail Migration", value: 120000, stage: "QUALIFIED", company: "GlobalRetail", contactName: "Mike Brown", probability: 25 },
  { title: "DataFlow Analytics", value: 75000, stage: "PROPOSAL", company: "DataFlow", contactName: "Lisa Wang", probability: 50 },
  { title: "CloudBase Enterprise", value: 200000, stage: "NEGOTIATION", company: "CloudBase", contactName: "Tom Wilson", probability: 75 },
  { title: "StartupHub Basic", value: 15000, stage: "CLOSED_WON", company: "StartupHub", contactName: "Alex Kim", probability: 100 },
  { title: "LegacyCorp Upgrade", value: 30000, stage: "CLOSED_LOST", company: "LegacyCorp", contactName: "Jane Doe", probability: 0 },
]

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = schema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

    const { name, email, password } = parsed.data
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { name, email, password: hashed } })

    const pipeline = await prisma.pipeline.create({
      data: { name: "Sales Pipeline", stages: "LEAD,QUALIFIED,PROPOSAL,NEGOTIATION,CLOSED_WON,CLOSED_LOST", userId: user.id },
    })

    // Auto-seed sample deals so new users see a populated pipeline
    for (const deal of sampleDeals) {
      await prisma.deal.create({
        data: { ...deal, userId: user.id, pipelineId: pipeline.id, stage: deal.stage as any },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

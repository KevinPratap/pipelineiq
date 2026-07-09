"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const createDealSchema = z.object({
  title: z.string().min(1),
  value: z.coerce.number().min(0),
  stage: z.enum(["LEAD", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"]).default("LEAD"),
  company: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  closeDate: z.string().optional(),
  priority: z.enum(["none", "low", "medium", "high"]).default("none"),
})

export async function createDeal(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const parsed = createDealSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Invalid input", issues: parsed.error.issues }

  const { closeDate, ...rest } = parsed.data

  const deal = await prisma.deal.create({
    data: {
      ...rest,
      closeDate: closeDate ? new Date(closeDate) : null,
      probability: rest.stage === "LEAD" ? 10 : rest.stage === "QUALIFIED" ? 25 : rest.stage === "PROPOSAL" ? 50 : rest.stage === "NEGOTIATION" ? 75 : rest.stage === "CLOSED_WON" ? 100 : 0,
      userId: session.user.id,
      pipelineId: (await prisma.pipeline.findFirst({ where: { userId: session.user.id } }))?.id || "",
    },
  })

  revalidatePath("/pipeline")
  return { success: true, deal }
}

export async function moveDeal(dealId: string, stage: string, exitReason?: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await prisma.deal.update({
    where: { id: dealId },
    data: {
      stage: stage as any,
      stageExitReason: stage === "CLOSED_LOST" ? (exitReason || null) : null,
      stageEnteredAt: new Date(),
    },
  })

  revalidatePath("/pipeline")
  return { success: true }
}

export async function updateDeal(dealId: string, data: Record<string, any>) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const updateData: any = { ...data }
  if (data.closeDate) updateData.closeDate = new Date(data.closeDate)

  await prisma.deal.update({ where: { id: dealId }, data: updateData })
  revalidatePath("/pipeline")
  revalidatePath(`/deals/${dealId}`)
  return { success: true }
}

export async function deleteDeal(dealId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await prisma.deal.delete({ where: { id: dealId } })
  revalidatePath("/pipeline")
  return { success: true }
}

export async function getDeals() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.deal.findMany({
    where: { userId: session.user.id },
    include: { activities: true },
    orderBy: { sortOrder: "asc" },
  })
}

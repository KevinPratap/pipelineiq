"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createActivity(dealId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const activity = await prisma.activity.create({
    data: {
      type: formData.get("type") as any || "NOTE",
      subject: formData.get("subject") as string || "",
      content: formData.get("content") as string || "",
      dealId,
      userId: session.user.id,
    },
  })

  revalidatePath(`/deals/${dealId}`)
  return { success: true, activity }
}

export async function getActivities(dealId: string) {
  return prisma.activity.findMany({
    where: { dealId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  })
}

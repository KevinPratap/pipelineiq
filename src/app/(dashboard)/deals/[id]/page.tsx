import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { DealDetail } from "./deal-detail"

export default async function DealPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return notFound()

  const { id } = await params
  const deal = await prisma.deal.findFirst({
    where: { id, userId: session.user.id },
    include: { activities: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } } },
  })

  if (!deal) return notFound()

  return <DealDetail deal={deal} />
}

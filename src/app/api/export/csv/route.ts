import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  const deals = await prisma.deal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const headers = ["Title", "Value", "Stage", "Company", "Contact", "Email", "Probability", "Priority", "Close Date", "Created"]
  const rows = deals.map((d) => [
    d.title,
    d.value.toString(),
    d.stage,
    d.company || "",
    d.contactName || "",
    d.contactEmail || "",
    `${d.probability}%`,
    d.priority || "none",
    d.closeDate ? new Date(d.closeDate).toLocaleDateString() : "",
    new Date(d.createdAt).toLocaleDateString(),
  ])

  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=pipelineiq-export.csv",
    },
  })
}

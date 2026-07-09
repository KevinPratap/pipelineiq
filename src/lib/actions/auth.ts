import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) return { error: "Invalid input" }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: "Email already in use" }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  })

  const pipeline = await prisma.pipeline.create({
    data: {
      name: "Sales Pipeline",
      stages: "LEAD,QUALIFIED,PROPOSAL,NEGOTIATION,CLOSED_WON,CLOSED_LOST",
      userId: user.id,
    },
  })

  return { success: true }
}

export async function signInAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" }
    }
    throw error
  }
}

import { NextResponse } from "next/server"

export async function GET() {
  const url = process.env.DATABASE_URL || "NOT SET"
  // Mask password for safety
  const masked = url.replace(/postgresql:\/\/[^:]+:([^@]+)@/, (_, pwd) =>
    `postgresql://***:***@`
  )
  return NextResponse.json({
    database_url: masked,
    length: url.length,
    has_password: url.includes(":***@") || url.includes(":postgres@"),
    auth_trust_host: process.env.AUTH_TRUST_HOST,
    railway_env: process.env.RAILWAY_ENVIRONMENT,
  })
}

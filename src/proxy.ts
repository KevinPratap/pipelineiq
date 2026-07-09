import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  const protectedPaths = ["/dashboard", "/pipeline", "/analytics", "/settings"]
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p))

  if (isProtected && !session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/(dashboard|pipeline|analytics|settings)/:path*"],
}

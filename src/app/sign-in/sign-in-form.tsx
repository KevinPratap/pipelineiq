"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SignInForm() {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData) => {
            const res = await fetch("/api/auth/callback/credentials", {
              method: "POST",
              body: new URLSearchParams({
                email: formData.get("email") as string,
                password: formData.get("password") as string,
                csrfToken: await getCsrfToken(),
              }),
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              redirect: "manual",
            })
            if (res.ok || res.status === 303) {
              router.push("/dashboard")
              router.refresh()
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" placeholder="demo@pipelineiq.dev" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Input id="password" name="password" type="password" placeholder="demo1234" required />
          </div>
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
      </CardContent>
    </Card>
  )
}

async function getCsrfToken() {
  const res = await fetch("/api/auth/csrf")
  const data = await res.json()
  return data.csrfToken
}

import { auth } from "@/lib/auth"
import { SettingsForm } from "./settings-form"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) return null

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account</p>
      </div>
      <SettingsForm userName={session.user.name || ""} userEmail={session.user.email || ""} />
    </div>
  )
}

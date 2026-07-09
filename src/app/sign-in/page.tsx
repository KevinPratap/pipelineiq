import { SignInForm } from "./sign-in-form"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your PipelineIQ account</p>
        </div>
        <SignInForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="font-medium underline underline-offset-4 hover:text-primary">
            Sign up
          </a>
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Demo: demo@pipelineiq.dev / demo1234
        </p>
      </div>
    </div>
  )
}

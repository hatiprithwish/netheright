"use client";

import { signIn } from "next-auth/react";
import { Code2, Github, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Hero/Brand */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />

        {/* Ghosted Diagram Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          {/* Abstract Nodes */}
          <div className="absolute top-1/3 left-1/4 w-32 h-20 border border-white/30 rounded-lg"></div>
          <div className="absolute top-1/3 right-1/4 w-32 h-20 border border-white/30 rounded-lg"></div>
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-48 h-24 border border-white/30 rounded-lg"></div>
          {/* Lines */}
          <div className="absolute top-[45%] left-[35%] w-[30%] h-[1px] bg-white/20"></div>
          <div className="absolute top-[38%] left-1/2 h-[20%] w-[1px] bg-white/20"></div>
        </div>

        <div className="relative z-10 p-12">
          <div className="flex items-center gap-3 text-2xl font-bold text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Code2 className="h-6 w-6" />
            </div>
            Netheright
          </div>
        </div>

        <div className="relative z-10 max-w-lg p-12">
          <h2 className="text-4xl font-bold leading-tight text-white mb-6">
            Master System Design with AI Guidance
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Practice high-stakes system design interviews. Get real-time
            feedback on your architecture choices, scalability trade-offs, and
            database schema diagrams.
          </p>
        </div>

        <div className="relative z-10 p-12 text-sm text-zinc-500 border-t border-white/5">
          © {new Date().getFullYear()} Netheright Inc.
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to your account to continue practicing
              </p>
            </div>

            {error === "OAuthAccountNotLinked" && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 text-sm text-destructive">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Account already exists</p>
                  <p className="mt-1">
                    You have already signed up with another provider for this
                    email. Please sign in with that provider to continue.
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              <button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-[#24292F] text-white rounded-xl font-medium hover:bg-[#24292F]/90 transition-all shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                <Github className="h-5 w-5" />
                Continue with GitHub
              </button>

              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-card text-foreground border border-border rounded-xl font-medium hover:bg-muted/50 transition-all shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">
              By signing in, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}

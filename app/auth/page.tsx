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
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Code2 className="h-8 w-8 text-white" />
            Netheright
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold mb-6">
            Master your technical interviews with AI
          </h2>
          <p className="text-zinc-400 text-lg">
            Practice system design and coding interviews with our advanced AI
            interviewer. Get real-time feedback and improve your skills.
          </p>
        </div>
        <div className="relative z-10 text-sm text-zinc-500">
          © {new Date().getFullYear()} Netheright Inc.
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex items-center justify-center p-8 bg-zinc-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Sign in to your account to continue practicing
            </p>
          </div>

          {error === "OAuthAccountNotLinked" && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-sm text-red-800">
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

          <div className="grid gap-4 mt-8">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center justify-center gap-3 px-4 py-3 bg-white text-zinc-700 border border-zinc-200 rounded-xl font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
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

            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="flex items-center justify-center gap-3 px-4 py-3 bg-[#24292F] text-white rounded-xl font-medium hover:bg-[#24292F]/90 transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
            >
              <Github className="h-5 w-5" />
              Continue with GitHub
            </button>
          </div>

          {/* <p className="text-center text-xs text-zinc-500 mt-8">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline hover:text-zinc-800">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-zinc-800">
              Privacy Policy
            </a>
            .
          </p> */}
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

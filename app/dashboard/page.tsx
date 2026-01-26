import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Shield, User, Mail, Calendar } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center gap-3">
          <Shield className="h-8 w-8 text-zinc-900 dark:text-zinc-50" />
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Protected Dashboard
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center gap-3">
              <User className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                User Profile
              </h2>
            </div>
            <div className="space-y-3">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="h-20 w-20 rounded-full border-4 border-zinc-200 dark:border-zinc-700"
                />
              )}
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Name
                </p>
                <p className="text-lg text-zinc-900 dark:text-zinc-50">
                  {session.user.name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Email
                </p>
                <p className="text-lg text-zinc-900 dark:text-zinc-50">
                  {session.user.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  User ID
                </p>
                <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
                  {session.user.id}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center gap-3">
              <Shield className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Access Information
              </h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  ✓ Authentication Verified
                </p>
                <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                  You have successfully authenticated and can access protected
                  resources.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Session Status
                </p>
                <p className="text-lg text-zinc-900 dark:text-zinc-50">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            About This Page
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            This is a protected route that requires authentication. Users who
            are not signed in will be automatically redirected to the home page.
            This demonstrates server-side authentication checks using NextAuth
            v5.
          </p>
          <div className="mt-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

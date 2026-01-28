import { AuthButton } from "@/frontend/ui/auth-button";
import { auth } from "@/lib/next-auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 font-sans dark:from-zinc-900 dark:to-black">
      <main className="flex w-full max-w-4xl flex-col items-center gap-8 px-6 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome to Netheright
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {session?.user
              ? `You're signed in as ${session.user.email}`
              : "Sign in to get started"}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Authentication Status
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {session?.user
                ? "You are currently authenticated"
                : "Please sign in to continue"}
            </p>
          </div>

          <AuthButton />

          {session?.user && (
            <div className="mt-8 rounded-lg bg-zinc-50 p-6 dark:bg-zinc-800">
              <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Session Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    User ID:
                  </span>
                  <span className="font-mono text-zinc-600 dark:text-zinc-400">
                    {session.user.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Name:
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {session.user.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Email:
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {session.user.email}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {session?.user && (
          <div className="mt-6 text-center">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Go to Protected Dashboard →
            </a>
          </div>
        )}

        <div className="text-center text-sm text-zinc-500 dark:text-zinc-500">
          <p>Powered by NextAuth v5 with Google and GitHub authentication</p>
        </div>
      </main>
    </div>
  );
}

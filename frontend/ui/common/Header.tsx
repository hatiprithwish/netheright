"use client";

import Link from "next/link";
import { Code2, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/frontend/ui/common/components/mode-toggle";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Netheright</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {isHomePage && (
            <>
              <Link
                href="#architecture"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Architecture
              </Link>
              <Link
                href="#tech"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Tech Stack
              </Link>
            </>
          )}
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/problems"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Problems
          </Link>

          <div className="flex items-center">
            <ModeToggle />
          </div>

          {session?.user ? (
            <div className="flex items-center gap-4 border-l border-border/40 pl-6">
              <div className="flex items-center gap-2">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full border border-border"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
                <span className="hidden text-sm font-medium text-foreground sm:inline-block">
                  {session.user.name?.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

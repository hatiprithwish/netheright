"use client";

import Link from "next/link";
import { Code2, LogOut, User } from "lucide-react";
import { useAuth } from "@/frontend/ui/hooks/useAuth";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/frontend/ui/common/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SwitchRoleModal } from "@/frontend/ui/common/components/SwitchRoleModal";
import { UserCog } from "lucide-react";
import packageJson from "@/package.json";

export default function Header() {
  const { currentUser, signOut } = useAuth();
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

          {currentUser ? (
            <div className="flex items-center gap-4 border-l border-border/40">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 outline-none rounded-full ring-offset-background transition-colors focus-visible:outline-none cursor-pointer">
                  {currentUser.image ? (
                    <Image
                      src={currentUser.image}
                      alt={currentUser.name || "User"}
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
                    {currentUser.name?.split(" ")[0]}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="font-normal p-3 flex items-center gap-3">
                    {currentUser.image ? (
                      <Image
                        src={currentUser.image}
                        alt={currentUser.name || "User"}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.roleName}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <SwitchRoleModal>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="cursor-pointer"
                    >
                      <UserCog className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Switch Role</span>
                    </DropdownMenuItem>
                  </SwitchRoleModal>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="p-2 text-xs text-center text-muted-foreground">
                    v{packageJson.version}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link
              href="/auth"
              className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

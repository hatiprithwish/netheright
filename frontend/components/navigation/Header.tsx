"use client";

import Link from "next/link";
import { Code2 } from "lucide-react";
import { useAuth } from "@/lib/next-auth/useAuth";
import ThemeToggler from "./ThemeToggler";
import DesktopNav from "./DesktopNav";
import UserDropdown from "./UserDropdown";
import MobileNav from "./MobileNav";

export default function Header() {
  const { currentUser, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Netheright</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <DesktopNav />
          <div className="flex items-center">
            <ThemeToggler variant="icon" />
          </div>
          <UserDropdown
            currentUser={currentUser}
            signOut={signOut}
            className="gap-4 border-l border-border/40 pl-4"
          />
        </div>

        {/* Mobile Navigation Toggle */}
        <MobileNav currentUser={currentUser} signOut={signOut} />
      </div>
    </nav>
  );
}

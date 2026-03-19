import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/frontend/components/shadcn/sheet";
import { HeaderLinks } from "./utils";
import ThemeToggler from "./ThemeToggler";

import UserDropdown from "./UserDropdown";

interface MobileNavProps {
  currentUser: any;
  signOut: () => void;
}

export default function MobileNav({ currentUser, signOut }: MobileNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 md:hidden">
      <UserDropdown
        currentUser={currentUser}
        signOut={signOut}
        className="gap-2"
      />

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[350px] px-4 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              {HeaderLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}

              <ThemeToggler variant="menu" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

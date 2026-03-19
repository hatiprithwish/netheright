import Image from "next/image";
import { User, LogOut, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/frontend/components/shadcn/dropdown-menu";
import { SwitchRoleModal } from "@/frontend/components/SwitchRoleModal";
import packageJson from "@/package.json";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface UserDropdownProps {
  currentUser: any;
  signOut: () => void;
  className?: string;
}

export default function UserDropdown({
  currentUser,
  signOut,
  className,
}: UserDropdownProps) {
  if (!currentUser) {
    return (
      <Link
        href="/auth"
        className={cn(
          "cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg",
          className,
        )}
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
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
  );
}

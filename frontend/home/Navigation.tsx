import Link from "next/link";
import { Code2 } from "lucide-react";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Netheright</span>
        </div>
        <div className="flex items-center gap-6">
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
          <Link
            href="/dashboard"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Netheright</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/hatiprithwish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/hatiprithwish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © 2026 Netheright. Production-grade system design platform.
        </div>
      </div>
    </footer>
  );
}

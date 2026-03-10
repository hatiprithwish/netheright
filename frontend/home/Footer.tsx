import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white">
              <Code2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-text-main">Netheright</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/hatiprithwish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-text-muted transition-colors hover:text-brand-primary"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/hatiprithwish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-text-muted transition-colors hover:text-brand-primary"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-text-muted">
          © 2026 Netheright. Production-grade system design platform.
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Code2 } from "lucide-react";
import dayjs from "dayjs";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/50 py-12 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Netheright</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Master System Design with AI-powered interactive interviews and
              real-time feedback.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Product
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/problems"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Problems
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Resources
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/architecture"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Architecture
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {dayjs().year()} Netheright. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/hatiprithwish/netheright"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors"
            >
              <Image
                src="/github.svg"
                alt="GitHub"
                width={16}
                height={16}
                className="opacity-70 transition-opacity hover:opacity-100 dark:invert"
              />
            </a>
            <a
              href="https://linkedin.com/in/hatiprithwish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors"
            >
              <Image
                src="/linkedin.svg"
                alt="LinkedIn"
                width={16}
                height={16}
                className="opacity-70 transition-opacity hover:opacity-100 dark:invert"
              />
            </a>
            <a
              href="https://x.com/hatiprithwish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors"
            >
              <Image
                src="/x.svg"
                alt="X (Twitter)"
                width={16}
                height={16}
                className="opacity-70 transition-opacity hover:opacity-100 dark:invert"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

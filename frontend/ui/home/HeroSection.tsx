import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 pt-32 pb-20">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Zap className="h-4 w-4" />
          Production-Grade System Design Platform
        </div>
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Master System Design
          <br />
          <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-3 bg-clip-text text-transparent">
            with Real-Time AI Feedback
          </span>
        </h1>
        <p className="mb-10 text-lg text-muted-foreground sm:text-xl lg:text-2xl">
          A full-stack Next.js application demonstrating 3-layer backend
          architecture, streaming AI responses, and production-ready engineering
          practices.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
          >
            Try Live Demo
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#architecture"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-8 py-4 text-lg font-semibold transition-all hover:bg-muted"
          >
            View Architecture
          </Link>
        </div>
      </div>
    </section>
  );
}

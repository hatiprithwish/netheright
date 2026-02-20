import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Database,
  Globe,
  Layout,
  Server,
  Zap,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            AI-Powered System Design Interview Prep
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Master System Design
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              with Real-Time AI Feedback
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-lg text-muted-foreground sm:text-xl lg:text-2xl">
            Practice high-stakes system design interviews with an AI senior
            architect. Get instant feedback on your diagrams, scalability
            trade-offs, and database choices.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Interview
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-4 text-lg font-semibold text-foreground transition-all hover:bg-muted/50 hover:border-border/80"
            >
              View Architecture
            </Link>
          </div>
        </div>

        {/* Abstract "Peek" of the tool */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="relative z-10 overflow-hidden rounded-xl border border-border bg-card/50 shadow-2xl backdrop-blur-sm dark:bg-slate-900/50">
            <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/80 px-4">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <div className="ml-4 h-6 w-64 rounded-md bg-muted-foreground/10"></div>
            </div>

            {/* Mock Canvas Area */}
            <div className="relative h-[400px] w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]">
              {/* Mock Nodes connected by lines (simulated) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                {/* Central Load Balancer */}
                <div className="relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-primary bg-card shadow-lg">
                  <Server className="h-8 w-8 text-primary" />
                  <span className="mt-2 text-xs font-semibold text-muted-foreground">
                    Load Balancer
                  </span>
                </div>

                {/* Connecting Lines */}
                <div className="absolute top-1/2 left-full h-0.5 w-16 bg-border"></div>
                <div className="absolute top-1/2 right-full h-0.5 w-16 bg-border"></div>
                <div className="absolute left-1/2 bottom-full h-16 w-0.5 bg-border"></div>

                {/* Satellite Nodes */}
                <div className="absolute top-1/2 -right-40 -translate-y-1/2 flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-border bg-card shadow-md">
                  <Database className="h-6 w-6 text-green-500" />
                  <span className="mt-1 text-[10px] font-medium text-muted-foreground">
                    Primary DB
                  </span>
                </div>

                <div className="absolute top-1/2 -left-40 -translate-y-1/2 flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-border bg-card shadow-md">
                  <Globe className="h-6 w-6 text-blue-500" />
                  <span className="mt-1 text-[10px] font-medium text-muted-foreground">
                    CDN
                  </span>
                </div>

                <div className="absolute -top-40 left-1/2 -translate-x-1/2 flex h-20 w-20 flex-col items-center justify-center rounded-lg border border-border bg-card shadow-md">
                  <Layout className="h-6 w-6 text-purple-500" />
                  <span className="mt-1 text-[10px] font-medium text-muted-foreground">
                    Client
                  </span>
                </div>

                {/* Floating Feedback Card */}
                <div className="absolute -right-32 bottom-12 z-20 w-64 rounded-lg border border-border bg-card p-3 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        AI Architect
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Good choice using a CDN for static assets. Ideally, you
                        should also consider a Redis cache for hot data to
                        reduce DB load.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Glow */}
          <div className="absolute -top-12 -left-12 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl filter"></div>
          <div className="absolute -bottom-12 -right-12 -z-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl filter"></div>
        </div>
      </div>
    </section>
  );
}

import { Zap, Shield, Activity } from "lucide-react";
import { ProductionFeatureCard } from "./cards/ProductionFeatureCard";

export function ProductionEngineeringSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Production-Ready Engineering
          </h2>
          <p className="text-lg text-muted-foreground">
            Performance, security, and observability built-in from day one
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <Zap className="h-6 w-6 text-chart-1" />
              Performance
            </h3>
            <ProductionFeatureCard
              title="Streaming LLM Responses"
              description="First token in <200ms using Vercel AI SDK streaming"
              metric="<200ms TTFB"
            />
            <ProductionFeatureCard
              title="Edge Deployment"
              description="Deployed on Vercel Edge Network for global low latency"
              metric="Global CDN"
            />
            <ProductionFeatureCard
              title="Connection Pooling"
              description="Neon's serverless Postgres with automatic connection management"
              metric="Auto-scaling"
            />
          </div>
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <Shield className="h-6 w-6 text-chart-2" />
              Security
            </h3>
            <ProductionFeatureCard
              title="Input Validation"
              description="Zod schemas validate all API requests before processing"
              metric="100% coverage"
            />
            <ProductionFeatureCard
              title="Data Sanitization"
              description="User inputs sanitized before sending to LLM to prevent injection"
              metric="XSS protected"
            />
            <ProductionFeatureCard
              title="Rate Limiting"
              description="Middleware-based rate limiting to prevent API abuse"
              metric="Configurable limits"
            />
          </div>
          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <Activity className="h-6 w-6 text-chart-3" />
              Monitoring
            </h3>
            <ProductionFeatureCard
              title="Error Tracking"
              description="Sentry integration for real-time error monitoring and alerting"
              metric="Real-time alerts"
            />
            <ProductionFeatureCard
              title="Structured Logging"
              description="Pino logger with contextual metadata for debugging"
              metric="JSON logs"
            />
            <ProductionFeatureCard
              title="Observability"
              description="Request tracing and performance metrics in production"
              metric="Full visibility"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

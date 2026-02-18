import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-4xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-chart-1/10 to-chart-3/10 p-12 text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
          Ready to Explore the Architecture?
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Try the live demo and see the engineering in action
        </p>
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
        >
          Start Interview
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

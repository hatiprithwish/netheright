import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-soft dark:border-gray-800 dark:bg-slate-900/50">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
          Ready to Explore the Architecture?
        </h2>
        <p className="mb-8 text-lg text-text-muted">
          Try the live demo and see the engineering in action
        </p>
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2 rounded-xl bg-brand-primary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-brand-primary/90 hover:shadow-xl hover:-translate-y-0.5"
        >
          Start Interview
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

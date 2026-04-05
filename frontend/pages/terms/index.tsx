import { TERMS_OF_SERVICE_CONTENT } from "./utils";
import { FileText } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-20">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-primary/10 p-4 ring-1 ring-primary/20 transition-all hover:bg-primary/15">
              <FileText className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Terms of Service
          </h1>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Last Updated: March 10, 2026
          </p>
        </div>

        {/* Content Section */}
        <div className="grid gap-8">
          {TERMS_OF_SERVICE_CONTENT.map((section, index) => (
            <section
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-8 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {section.title}
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Footer Note
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            If you have any questions or concerns about our terms of service,
            please don't hesitate to reach out to our legal team at
            legal@netheright.io.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default TermsPage;

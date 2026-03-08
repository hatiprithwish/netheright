// DONE_PRITH

import Header from "@/frontend/ui/common/Header";
import Footer from "@/frontend/ui/common/Footer";
import {
  HeroSection,
  InterviewProcessSection,
  MetricsSection,
  CTASection,
} from "@/frontend/ui/home";

export default async function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <HeroSection />
        <InterviewProcessSection />
        <MetricsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

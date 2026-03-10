// DONE_PRITH

import Header from "@/frontend/common/Header";
import Footer from "@/frontend/common/Footer";
import {
  HeroSection,
  InterviewProcessSection,
  MetricsSection,
  CTASection,
} from "@/frontend/home";

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

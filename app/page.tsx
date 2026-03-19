// DONE_PRITH

import Footer from "@/frontend/components/navigation/Footer";
import Header from "@/frontend/components/navigation/Header";
import HeroSection from "@/frontend/pages/home/HeroSection";
import InterviewProcessSection from "@/frontend/pages/home/InterviewProcessSection";
import MetricsSection from "@/frontend/pages/home/MetricsSection";
import CTASection from "@/frontend/pages/home/CTASection";

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

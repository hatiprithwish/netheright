import {
  Navigation,
  HeroSection,
  WhyNextJsSection,
  ThreeLayerArchitectureSection,
  DatabaseSchemaSection,
  ProductionEngineeringSection,
  TechStackSection,
  CodeQualitySection,
  UpcomingReleasesSection,
  MetricsSection,
  CTASection,
  Footer,
} from "@/frontend/ui/home";

export default async function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      <HeroSection />
      <WhyNextJsSection />
      <ThreeLayerArchitectureSection />
      <DatabaseSchemaSection />
      <ProductionEngineeringSection />
      <TechStackSection />
      <CodeQualitySection />
      <UpcomingReleasesSection />
      <MetricsSection />
      <CTASection />
      <Footer />
    </main>
  );
}

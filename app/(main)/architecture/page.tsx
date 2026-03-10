import {
  WhyNextJsSection,
  ThreeLayerArchitectureSection,
  DatabaseSchemaSection,
  ProductionEngineeringSection,
  TechStackSection,
  CodeQualitySection,
  UpcomingReleasesSection,
  ArchitecturalTradeoffsSection,
} from "@/frontend/home";

const ArchitecturePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <WhyNextJsSection />
      <ThreeLayerArchitectureSection />
      <DatabaseSchemaSection />
      <ProductionEngineeringSection />
      <TechStackSection />
      <CodeQualitySection />
      <UpcomingReleasesSection />
      <ArchitecturalTradeoffsSection />
    </main>
  );
};

export default ArchitecturePage;

import ArchitecturalTradeoffsSection from "@/frontend/pages/architecture/ArchitecturalTradeoffsSection";
import CodeQualitySection from "@/frontend/pages/architecture/CodeQualitySection";
import DatabaseSchemaSection from "@/frontend/pages/architecture/DatabaseSchemaSection";
import ProductionEngineeringSection from "@/frontend/pages/architecture/ProductionEngineeringSection";
import TechStackSection from "@/frontend/pages/architecture/TechStackSection";
import ThreeLayerArchitectureSection from "@/frontend/pages/architecture/ThreeLayerArchitectureSection";
import UpcomingReleasesSection from "@/frontend/pages/architecture/UpcomingReleasesSection";
import WhyNextJsSection from "@/frontend/pages/architecture/WhyNextJsSection";

const ArchitecturePage = () => {
  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
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

import DatabaseSchemaSection from "@/frontend/pages/architecture/DatabaseSchemaSection";
import ProductionEngineeringSection from "@/frontend/pages/architecture/ProductionEngineeringSection";
import TechStackSection from "@/frontend/pages/architecture/TechStackSection";
import ThreeLayerArchitectureSection from "@/frontend/pages/architecture/ThreeLayerArchitectureSection";

const ArchitecturePage = () => {
  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <ThreeLayerArchitectureSection />
      <DatabaseSchemaSection />
      <ProductionEngineeringSection />
      <TechStackSection />
    </main>
  );
};

export default ArchitecturePage;

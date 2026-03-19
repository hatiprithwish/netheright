// DONE_PRITH

import Footer from "@/frontend/components/navigation/Footer";
import Header from "@/frontend/components/navigation/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 w-full pt-16">{children}</main>
      <Footer />
    </>
  );
}

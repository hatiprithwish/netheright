// DONE_PRITH

import Header from "@/frontend/common/Header";
import Footer from "@/frontend/common/Footer";

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

"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isInterviewPage =
    pathname?.startsWith("/interview/") && pathname.split("/").length >= 4;

  if (isAuthPage || isInterviewPage) {
    return null;
  }

  return <Footer />;
}

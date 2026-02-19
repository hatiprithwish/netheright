"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isInterviewPage =
    pathname?.startsWith("/interview/") && pathname.split("/").length >= 4;

  if (isAuthPage || isInterviewPage) {
    return null;
  }

  const isHomePage = pathname === "/";

  return (
    <>
      <Header />
      {!isHomePage && <div className="h-16" />}
    </>
  );
}

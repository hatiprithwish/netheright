// DONE_PRITH

import TermsPage from "@/frontend/pages/terms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Netheright",
  description:
    "Read our terms and conditions for using the Netheright platform.",
};

export default function Page() {
  return <TermsPage />;
}

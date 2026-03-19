// DONE_PRITH

import PrivacyPage from "@/frontend/pages/privacy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Netheright",
  description:
    "Learn how we collect, use, and protect your information at Netheright.",
};

export default function Page() {
  return <PrivacyPage />;
}

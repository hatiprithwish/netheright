export interface LegalSection {
  title: string;
  content: string;
}

export const PRIVACY_POLICY_CONTENT: LegalSection[] = [
  {
    title: "1. Information We Collect",
    content:
      "We collect information you provide directly to us when you create an account, use our AI-powered interview services, or communicate with us. This may include your name, email address, and records of your interactions with our AI systems.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use the information we collect to provide, maintain, and improve our services, including training our AI models (on anonymized data) to provide better feedback and more accurate interview simulations.",
  },
  {
    title: "3. Data Retention",
    content:
      "We store your interview history and performance metrics for as long as your account is active or as needed to provide you with the full benefits of our platform's progress tracking features.",
  },
  {
    title: "4. Security",
    content:
      "We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.",
  },
  {
    title: "5. Contact Us",
    content:
      "If you have any questions about this Privacy Policy, please contact us at support@netheright.io.",
  },
];

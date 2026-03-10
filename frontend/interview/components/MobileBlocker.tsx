"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";

export function MobileBlocker() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background p-6 text-center">
      <div className="rounded-full bg-primary/10 p-4 mb-6">
        <Smartphone className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">
        Desktop Experience Only
      </h2>
      <p className="text-muted-foreground max-w-md">
        The System Design Interview Tutor requires a large canvas for
        diagramming. Please access this tool on a desktop or laptop computer.
      </p>
    </div>
  );
}

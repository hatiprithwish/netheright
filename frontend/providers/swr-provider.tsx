"use client";

import { SWRConfig } from "swr";
import React from "react";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        errorRetryCount: 3,
      }}
    >
      {children}
    </SWRConfig>
  );
}

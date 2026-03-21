// DONE_PRITH

"use client";

import { SWRConfig } from "swr";
import React from "react";

function SWRProvider({ children }: { children: React.ReactNode }) {
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

export default SWRProvider;

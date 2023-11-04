"use client";

import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "jotai/react";
import * as React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <NextUIProvider>{children}</NextUIProvider>
    </Provider>
  );
}

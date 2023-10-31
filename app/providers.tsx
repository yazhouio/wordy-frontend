"use client";

import { WsContext } from "@/app/lib/websocket";
import { NextUIProvider } from "@nextui-org/react";
import * as React from "react";
import { useInitWs } from "./lib/hooks";
import { Provider } from "jotai/react";
import { getCookie } from "cookies-next";
import { closeEvent$ } from "./lib/subjects";
import toasts from "./login/toasts";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <NextUIProvider>{children}</NextUIProvider>
    </Provider>
  );
}

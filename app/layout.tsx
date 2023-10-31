"use client";
import { Providers } from "@/app/providers";
import { getCookie } from "cookies-next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";
import { useInitWs } from "./lib/hooks";
import { chats$, closeEvent$ } from "./lib/subjects";
import { WsContext } from "./lib/websocket";
import Toasts from "./login/toasts";
const db = require("./lib/db").default;

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = getCookie("access_token");
  const send = useInitWs(accessToken);
  React.useEffect(() => {
    const wsClose = closeEvent$.subscribe(() => {
      Toasts.open({
        title: "服务连接中",
        content: "",
        type: "error",
      });
    });

    const chat2db = chats$.subscribe((chat) => {
      db.table("chat").add(chat);
    });

    return () => {
      wsClose.unsubscribe();
      chat2db.unsubscribe();
    };
  }, []);
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <WsContext.Provider value={send}>
            {children}
            <div id="base-modal" />
          </WsContext.Provider>
        </Providers>
      </body>
    </html>
  );
}

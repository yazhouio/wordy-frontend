"use client";
import { Providers } from "@/app/providers";
import { getCookie, setCookie } from "cookies-next";
import { Inter } from "next/font/google";
import React, { useState } from "react";
import "./globals.css";
import { clientBase64ToString } from "./lib/base64";
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
  const [accessToken, setAccessToken] = useState(getCookie("access_token"));
  const refreshToken = () => {
    const refresh_token = getCookie("refresh_token");
    const url = process.env.NEXT_PUBLIC_ENDPOINT;

    if (refresh_token) {
      fetch(url+"api/refresh_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.access_token) {
            const accessTokenData = JSON.parse(clientBase64ToString(res.access_token.split(".")[1]));

            setCookie("access_token", res.access_token);
            setCookie("access_token", res.access_token, {
              maxAge: accessTokenData.exp - Date.now() / 1000,
              path: "/",
            });

          }
        });
    }
  }

  React.useEffect(() => {
    if (!accessToken) {
      return
    }
    const json = clientBase64ToString(accessToken?.split(".")[1]);
    const { exp } = JSON.parse(json);
    if (exp * 1000 < Date.now()) {
      setAccessToken("");
    } else if (exp * 1000 < Date.now() + 1000 * 60 * 5) {
      refreshToken();
    } else {
      setTimeout(refreshToken, (exp * 1000 - Date.now() - 1000 * 60 * 5));
    }

  }, [accessToken]);
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

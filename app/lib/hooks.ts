import React from "react";
import { IWsContext, WsRequest } from "../interfaces";
import { initWs } from "./websocket";
import { message$, localMessage$, chat$ } from "./subjects";
import { BehaviorSubject, filter, merge, mergeWith, scan } from "rxjs";
import { atomWithObservable } from "jotai/utils";
import { useAtom } from "jotai";

export const useInitWs = (accessToken?: string) => {
  const ref = React.useRef(0);
  const [send, setSend] = React.useState<IWsContext>({});

  React.useLayoutEffect(() => {
    if (!accessToken) {
      return;
    }
    ref.current = 1;
    const { process$, connection$ } = initWs(accessToken);
    let proSubscription = process$.subscribe((message) => {
      message$.next(message);
    });
    setSend({
      send: (message: WsRequest) => {
        localMessage$.next({ ...message, isMe: true });
        connection$.next(message);
      },
    });
    return () => {
      proSubscription.unsubscribe();
      // conSubscription.unsubscribe();
    };
  }, [accessToken]);
  return send;
};

export const useChatList = (from: number, to: number) => {
  const [{ subject, atom }] = React.useState(() => {
    let chats$ = message$.pipe(
      mergeWith(localMessage$),
      filter((message: WsRequest) => {
        return (
          message.eventType === "chat" &&
          ((message.from === from && message.to === to) ||
            (message.from === to && message.to === from))
        );
      }),
      scan((acc: WsRequest[], currentValue) => {
        const accumulatedData = [...acc, currentValue];
        return accumulatedData;
      }, [])
    );

    const subject$ = new BehaviorSubject<WsRequest[]>([]).pipe(
      mergeWith(chats$)
    );
    const atom = atomWithObservable<WsRequest[]>(() => subject$);
    return {
      subject: subject$,
      atom,
    };
  });
  const [list] = useAtom(atom);
  return {
    list,
    subject,
  }
};

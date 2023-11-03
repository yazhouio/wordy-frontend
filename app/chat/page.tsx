"use client";

import ChatItem from "@/app/chat/ChatItem";
import { EventType, WsRequest } from "@/app/interfaces";
import {
  linkStatus$
} from "@/app/lib/subjects";
import { WsContext } from "@/app/lib/websocket";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { useAtom } from "jotai";
import { atomWithObservable } from "jotai/utils";
import * as React from "react";
import db from "../lib/db";
import { useChatList } from "../lib/hooks";

const linkStatusAtom = atomWithObservable<boolean>(() => linkStatus$);

const Chat = () => {
  const { send } = React.useContext(WsContext);
  const [initList, setInitList] = React.useState<WsRequest[]>([]);
  const [value, setValue] = React.useState("");
  const [status] = useAtom(linkStatusAtom);
  const { list } = useChatList(1, 0); // todo: 从cookie中获取

  const all = React.useMemo(() => {
    return [...initList, ...list];
  }, [initList, list]);

  const getDbList = async () => {
    await db.open();
    const list = await db
      .table("chat")
      .where(["from", "to"])
      .equals([0, 1])
      .or("[from+to]")
      .equals([1, 0])
      .sortBy("id");
    // .toArray();
    setInitList(list);
  };

  React.useEffect(() => {
    getDbList();
  }, []);

  return (
    <main className="flex overflow-hidden h-screen min-w-full p-4 flex-col">
      <h1 className="flex-none text-foreground">英语启蒙</h1>
      <div className="flex flex-auto overflow-hidden flex-col">
        <div className="flex-auto overflow-auto">
          {all.map((item, index) => (
            <ChatItem
              key={index}
              isMe={item.isMe}
              message={item.event?.chat!}
              msgId={item.msgId}
            />
          ))}
        </div>
        <Card className="flex-none">
          <CardBody className="flex flex-row gap-2">
            <div className="flex-auto">
              <Input
                placeholder={"请输入"}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
            </div>
            <Button
              className="flex-none"
              isLoading={!status}
              onClick={() => {
                send?.({
                  from: 1,
                  event: { chat: value },
                  eventType: EventType.Chat,
                  to: 0,
                  msgId: Math.random().toString(32).slice(2),
                });
              }}
            >
              发送
            </Button>
          </CardBody>
        </Card>
      </div>
    </main>
  );
};

export default Chat;

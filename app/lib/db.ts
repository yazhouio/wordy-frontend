"use client";
import Dexie from "dexie";

const initDb = () => {
  const db = new Dexie("chat");
  db.version(1).stores({
    chat: "++id, msgId, replyMsgId, createdAt, updatedAt, eventType, event, *from, *to, *isMe, [from+to]",
  });
  return db;
};

export default initDb();

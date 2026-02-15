import { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../api/chat";
import type { ChatMessage } from "../store/chatStore";

export function useMessages(chatroomID: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  useEffect(() => {
    getMessages(chatroomID).then(setMessages);
  }, [chatroomID]);
  async function handleSend(content: string) {
    await sendMessage(chatroomID, content);
  }
  return [messages, handleSend];
}

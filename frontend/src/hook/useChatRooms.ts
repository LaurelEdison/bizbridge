import { useState, useEffect } from "react";
import type { ChatMessage } from "../store/chatStore";
import { useWebsocket } from "./useWebsocket";
import { getMessages } from "../api/chat";

export function useChat(chatRoomID: string) {
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const handleIncoming = (msg: ChatMessage) => {
		setMessages((prev) => [...prev, msg])
	}
	useWebsocket(chatRoomID, handleIncoming)

	useEffect(() => {
		if (!chatRoomID) return;
		setMessages([]);
		getMessages(chatRoomID).then(setMessages)
	}, [chatRoomID])

	return {
		messages,
	};
}

import { apiFetch } from "./client";
import type { ChatMessage, ChatRoom } from "../store/chatStore";
export async function createChatRoom(recipientID: string) {
	const res = await apiFetch("/bizbridge/social/chat", {
		method: "POST",
		body: JSON.stringify({
			recipient_id: recipientID
		}),
	});
	return res;
}
export async function getChatRooms(): Promise<ChatRoom[]> {
	return apiFetch<ChatRoom[]>(`/bizbridge/social/chat`);
}
export async function getMessages(chatRoomID: string): Promise<ChatMessage[]> {
	return apiFetch(`/bizbridge/social/${chatRoomID}/message`);
}

export async function sendMessage(chatRoomID: string, content: string) {
	return apiFetch(`/bizbridge/social/${chatRoomID}/message`, {
		method: "POST",
		body: JSON.stringify({ content }),
	});
}

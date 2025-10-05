import { apiFetch } from "./client";
export async function createChatRoom(recipientID: string) {
	const res = await apiFetch("/bizbridge/social/chat", {
		method: "POST",
		body: JSON.stringify({
			recipient_id: recipientID
		}),
	});
	return res
}

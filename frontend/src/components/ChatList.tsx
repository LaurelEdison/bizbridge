import { useState } from "react";
import { createChatRoom } from "../api/chat";
export function ChatList() {
	const [recipientID, setRecipientID] = useState("")
	async function handleCreate() {
		try {
			const chatRoom = await createChatRoom(recipientID);
			console.log("Created chat room successfully", chatRoom);
		} catch {
			console.error("Failed to create chatroom");

		}
	}
	return (
		<div>
			<input
				type="text"
				placeholder="Enter recipient uuid"
				value={recipientID}
				onChange={(e) => setRecipientID(e.target.value)}
				className="border rounded-lg p-2 mr-2"
			/>
			<button
				onClick={handleCreate}
				className="bg-blue-600 text-white px-4 py-2 rounded-lg"
			>
				Start Chat
			</button>
		</div >
	)
}

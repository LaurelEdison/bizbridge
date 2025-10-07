import { useChat } from "../hook/useChatRooms";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { sendMessage } from "../api/chat";

export function ChatRoom({ chatRoomID }: { chatRoomID: string }) {
	const { messages } = useChat(chatRoomID)
	const [input, setInput] = useState("")
	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && input.trim() != "") {
			sendMessage(chatRoomID, input.trim());
			setInput("");
		}
	};
	return (
		<div className="p-4">
			<div className="spcae-y-2">
				{messages.map((m, i) => (
					<p key={i}>{m.content}</p>
				))}
			</div>
			<input className="mt-4 border p-2 w-full rounded"
				value={input}
				onKeyDown={handleKeyDown}
				placeholder="Type a message..."
				onChange={(e) => setInput(e.target.value)}
			/>
		</div>
	)
}

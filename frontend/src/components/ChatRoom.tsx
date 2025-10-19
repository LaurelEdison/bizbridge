import { useChat } from "../hook/useChatRooms";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { sendMessage } from "../api/chat";
import { useAuthStore } from "../store/auth";

export function ChatRoom({ chatRoomID }: { chatRoomID: string }) {
	const { messages } = useChat(chatRoomID);
	const [input, setInput] = useState("");
	const { role, customer, company } = useAuthStore();

	const myID = role === "customer" ? customer?.id : company?.id;

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && input.trim() !== "") {
			sendMessage(chatRoomID, input.trim());
			setInput("");
		}
	};

	return (
		<div className="flex flex-col h-full p-4 bg-gray-50">
			<div className="flex-1 overflow-y-auto space-y-2 mb-4">
				{messages.map((m) => {
					const isMine = m.sender.id === myID;
					return (
						<div
							key={m.id}
							className={`flex ${isMine ? "justify-end" : "justify-start"}`}
						>
							<div
								className={`max-w-xs px-4 py-2 rounded-lg break-words
                  ${isMine ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"}`}
							>
								<div className="text-sm font-semibold">
									{!isMine && m.sender.name}
								</div>
								<div className="text-sm">{m.content}</div>
								{m.sent_at && (
									<div className="text-xs text-gray-400 mt-1 text-right">
										{new Date(m.sent_at.Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			<input
				className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Type a message..."
			/>
		</div>
	);
}

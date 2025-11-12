import { useChat } from "../hook/useChatRooms";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import { sendMessage } from "../api/chat";
import { useAuthStore } from "../store/auth";
import CreateOrderButton from "./CreateOrderButton";
import defaultAvatar from "../assets/defaultpfp.jpg";

export function ChatRoom({ chatRoomID, companyID, customerID }: { chatRoomID: string, companyID: string, customerID: string }) {
	const { messages } = useChat(chatRoomID);
	const [input, setInput] = useState("");
	const { role, customer, company } = useAuthStore();
	const myID = role === "customer" ? customer?.id : company?.id;
	const otherID = myID === customerID ? companyID : customerID;

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && input.trim() !== "") {
			sendMessage(chatRoomID, input.trim());
			setInput("");
		}
	};

	return (
		<div className="flex flex-col h-full bg-gradient-to-b from-gray-100 to-gray-50">
			{/* Messages */}
			<div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
				{messages.map((m, idx) => {
					const isMine = m.sender.id === myID;
					const showAvatar =
						!isMine &&
						(m.sender.photourl || m.sender.name) &&
						(messages[idx - 1]?.sender.id !== m.sender.id);
					const photoURL = m.sender.photourl
					const safePhotoURL =
						photoURL && photoURL.trim() !== ""
							? photoURL
							: "../assets/defaultpfp.jpg";
					return (
						<div
							key={m.id}
							className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
						>
							{showAvatar ? (
								<img
									src={safePhotoURL}
									alt={m.sender.name}
									className="w-8 h-8 rounded-full object-cover shadow-sm"
									onError={(e) =>
										((e.target as HTMLImageElement).src = defaultAvatar)
									}
								/>
							) : (
								<div className="w-8" /> // spacer
							)}

							<div
								className={`relative max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl shadow-sm break-words transition-all
								${isMine
										? "bg-[#094233] text-white rounded-br-sm"
										: "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"}`}
							>
								{!isMine && showAvatar && (
									<div className="text-xs font-semibold text-gray-500 mb-1">
										{m.sender.name}
									</div>
								)}
								<div className="text-sm leading-snug whitespace-pre-wrap">
									{m.content}
								</div>
								{m.sent_at && (
									<div
										className={`text-[10px] mt-1 ${isMine ? "text-green-100" : "text-gray-400"} text-right`}
									>
										{new Date(m.sent_at.Time).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* Input + Order */}
			<div className="sticky bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-3 flex items-center gap-2">
				<CreateOrderButton recipientId={otherID} chatRoomID={chatRoomID} />

				<input
					className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#094233] transition"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Type a message..."
				/>

				<button
					onClick={() => {
						if (input.trim() !== "") {
							sendMessage(chatRoomID, input.trim());
							setInput("");
						}
					}}
					className="bg-[rgba(252,204,98,1)] hover:bg-yellow-400 text-[#094233] px-4 py-2 rounded-full text-sm font-semibold transition"
				>
					Send
				</button>
			</div>
		</div>
	);
}

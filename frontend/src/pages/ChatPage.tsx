import { useState } from "react";
import { ChatRoom } from "../components/ChatRoom";
import { ChatList } from "../components/ChatList";
import type { ChatRoom as ChatRoomType } from "../store/chatStore";
import { Navbar } from "../components/Navbar";

export function ChatPage() {
	const [selectedRoom, setSelectRoom] = useState<ChatRoomType | null>(null);
	return (
		<>
			<Navbar />
			<div className="flex h-screen">
				<div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
					<h2 className="font-semibold mb-2 text-lq">Chats</h2>
					<ChatList
						onSelect={setSelectRoom}
						selectedRoomID={selectedRoom?.id}
					/>
				</div>
				<div className="flex-1 p-4">
					{selectedRoom ? (
						<ChatRoom chatRoomID={selectedRoom.id} />
					) : (
						<div className="text-gray-500 flex items-center justify-center h-full">
							Select a chat to start messaging
						</div>
					)}
				</div>
			</div>
		</>
	);

}


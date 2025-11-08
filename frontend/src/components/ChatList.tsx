import { useEffect, useState } from "react";
import { getChatRooms } from "../api/chat";
import type { ChatRoom } from "../store/chatStore";
import { useAuthStore } from "../store/auth";

type Props = {
	selectedRoomID?: string | null;
	onSelect: (room: ChatRoom) => void;
};

export function ChatList({ selectedRoomID, onSelect }: Props) {
	const [rooms, setRooms] = useState<ChatRoom[]>([]);
	const { role, customer, company } = useAuthStore();
	const myID = role === "customer" ? customer?.id : company?.id;

	useEffect(() => {
		if (!role) return;
		let mounted = true;
		getChatRooms()
			.then((rs) => {
				if (mounted) setRooms(rs);
			})
			.catch((err) => console.error("Failed to fetch chat rooms", err));
		return () => {
			mounted = false;
		};
	}, [role, company?.id, customer?.id]);

	return (
		<div className="w-80 border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white flex flex-col shadow-sm">
			<div className="px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
				<h2 className="text-lg font-semibold text-gray-800">Chats</h2>
			</div>

			<ul className="flex-1 overflow-y-auto">
				{rooms.length === 0 ? (
					<p className="text-center text-gray-400 text-sm mt-6">
						No conversations yet
					</p>
				) : (
					rooms.map((room) => {
						const customerID = room.customer_id;
						const isCustomer = myID === customerID;

						const displayName = isCustomer
							? room.company_name
							: room.customer_name;
						const photoURL = isCustomer
							? room.company_photourl
							: room.customer_photourl;

						const isSelected = selectedRoomID === room.id;
						const safePhotoURL =
							photoURL && photoURL.trim() !== ""
								? photoURL
								: "../assets/defaultpfp.jpg";

						return (
							<li
								key={room.id}
								onClick={() => onSelect(room)}
								className={`flex items-center gap-3 p-3 cursor-pointer transition-all 
									${isSelected
										? "bg-blue-100 shadow-inner border-l-4 border-blue-500"
										: "hover:bg-gray-100"
									}`}
							>
								<div className="relative">
									<img
										src={safePhotoURL}
										alt={displayName || "Chat Partner"}
										className="w-11 h-11 rounded-full object-cover border border-gray-300 shadow-sm"
										onError={(e) => {
											(e.target as HTMLImageElement).src =
												"/default-avatar.png";
										}}
									/>
									<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
								</div>

								<div className="flex flex-col flex-1 min-w-0">
									<div className="flex items-center justify-between">
										<span className="font-semibold text-gray-800 truncate">
											{displayName ?? "Unknown"}
										</span>
										<span className="text-xs text-gray-400 ml-2">
											12:45 PM
										</span>
									</div>
									<span className="text-sm text-gray-500 truncate mt-0.5">
										Message preview here...
									</span>
								</div>
							</li>
						);
					})
				)}
			</ul>
		</div>
	);
}

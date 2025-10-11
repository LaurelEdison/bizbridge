import { useEffect, useState } from "react"
import { getChatRooms } from "../api/chat";
import type { ChatRoom } from "../store/chatStore";
import { useAuthStore } from "../store/auth";

type Props = {
	selectedRoomID?: string | null;
	onSelect: (room: ChatRoom) => void
};
export function ChatList({ selectedRoomID, onSelect }: Props) {
	const [rooms, setRooms] = useState<ChatRoom[]>([])
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
		return () => { mounted = false; }
	}, [role, company?.id, customer?.id]);

	return (
		<div className="w-80 border-r border-gray-200 bg-white flex flex-col">
			<ul className="flex-1 overflow-y-auto">
				{rooms.map((room) => {
					const customerID = room.customer_id;
					const companyID = room.company_id;
					const name =
						myID && customerID && companyID
							? myID === customerID
								? room.company_name
								: room.customer_name
							: companyID ?? customerID ?? room.id;
					const displayName = name ?? room.id;
					const isSelected = selectedRoomID === room.id;

					return (
						<li
							key={room.id}
							onClick={() => onSelect(room)}
							className={`flex flex-col p-4 cursor-pointer transition-colors rounded-r-lg 
                ${isSelected ? "bg-blue-100" : "hover:bg-gray-100"}`}
						>
							<span className="font-medium text-gray-800">{displayName}</span>
							<span className="text-sm text-gray-500 truncate">Message preview here</span>
						</li>
					)
				})}
			</ul>
		</div>
	);
}

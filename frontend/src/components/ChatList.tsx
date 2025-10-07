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
		if (!role) {
			console.log("Not logged in yet");
			return
		}
		console.log("logged in now");
		let mounted = true
		getChatRooms()
			.then((rs) => {
				if (mounted) setRooms(rs)
			})
			.catch((err) => {
				console.error("Failed to fetch chat rooms ", err);

			});
		return () => {
			mounted = false;
		}
	}, [role, company?.id, customer?.id]);

	return (
		<div className="w-80 border-r overflow-auto">
			<h3 className="p-4 font-semibold">Chats</h3>
			<ul>
				{rooms.map((room) => {
					const customerID = room.customer_id;
					const companyID = room.company_id;

					const otherID =
						myID && customerID && companyID
							? myID === customerID
								? companyID
								: customerID
							: companyID ?? customerID ?? room.id;
					const displayName = room.id ?? otherID
					return (
						<li
							key={room.id}
							className={`p-3 hover:bg-gray-100 cursor-pointer ${selectedRoomID === room.id ? "bg-blue-50" : ""}`}
							onClick={() => onSelect(room)}
						>
							<div className="text-sm font-medium"> {displayName}</div>
							<div className="text-xs text-gray-500">
								Message preview here
							</div>
						</li>
					)
				})}
			</ul>
		</div>
	);
}

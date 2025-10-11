import { create } from "zustand";
//TODO: Add more metadata to chatmessages, sender id, name/username

export type Sender = {
	id: string;
	name: string;
	email: string;
	role: string;
}
export type ChatMessage = {
	id: string;
	chat_room_id: string;
	sender: Sender;
	content?: string;
	file_url?: string;
	file_name?: string;
	file_size?: string;
	SentAt?: string;
	IsRead?: string;
}
export type ChatRoom = {
	id: string;
	customer_id: string;
	customer_name: string;
	company_id: string;
	company_name: string;
	updated_at: string;
	created_at: string;
	messages: ChatMessage[];
}


export type ChatState = {
	rooms: Record<string, ChatRoom>;
	currentRoomID: string | null;
	setCurrentRoom: (id: string) => void;
	addRoom: (room: ChatRoom) => void;
	addMessage: (roomID: string, msg: ChatMessage) => void;
}


export const useChatStore = create<ChatState>((set) => ({
	rooms: {},
	currentRoomID: null,
	setCurrentRoom: (id) => set({ currentRoomID: id }),
	addMessage: (roomID, msg) =>
		set((state) => ({
			rooms: {
				...state.rooms,
				[roomID]: {
					...state.rooms[roomID],
					messages: [...(state.rooms[roomID]?.messages || []), msg]
				},
			},

		})),
	addRoom: (room) => set((state) => ({
		rooms: { ...state.rooms, [room.id]: room }
	}))
}))

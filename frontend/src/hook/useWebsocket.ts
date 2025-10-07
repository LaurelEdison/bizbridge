import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/auth";

export function useWebsocket(chatroomID: string, onMessage: (msg: any) => void) {
	const wsRef = useRef<WebSocket | null>(null)
	const { token } = useAuthStore();
	useEffect(() => {
		if (!token) return;
		const ws = new WebSocket(`ws://localhost:8080/bizbridge/social/${chatroomID}?token=${token}`);
		ws.onmessage = (event) => {
			const data = JSON.parse(event.data)
			onMessage(data.payload);
		};
		ws.onopen = () => console.log("Connection opened at ", chatroomID);
		ws.onclose = () => console.log("Connection closed at ", chatroomID);

		wsRef.current = ws;

		return () => ws.close();
	}, [chatroomID, token])
	return {
		send: (message: any) => wsRef.current?.send(JSON.stringify(message))
	};
}

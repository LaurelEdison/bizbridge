import { useAuthStore } from "../store/auth";

export async function apiFetch<T>(
	url: string,
	options: RequestInit = {}
): Promise<T> {
	const token = useAuthStore.getState().token;
	const res = await fetch(`http://localhost:8080${url}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Fetch error ${res.status}: ${text}`);
	}
	return (await res.json()) as T;
}

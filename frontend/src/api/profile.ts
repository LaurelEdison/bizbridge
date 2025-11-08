import { useAuthStore } from "../store/auth";
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function uploadProfilePicture(
	role: "customer" | "company" | null,
	file: File
): Promise<string> {
	const token = useAuthStore.getState().token;
	const formData = new FormData();
	formData.append("file", file);

	const res = await fetch(`${baseUrl}/${role}/upload-photo`, {
		method: "POST",
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		body: formData,
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Upload failed ${res.status}: ${text}`);
	}

	const data = await res.json();
	let url: string = data.url;
	if (url.startsWith("/")) {
		url = `${baseUrl}${url}`;
	}
	return data.url;
}

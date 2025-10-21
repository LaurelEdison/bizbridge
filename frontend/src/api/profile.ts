import { useAuthStore } from "../store/auth";
export async function uploadProfilePicture(
	role: "customer" | "company" | null,
	file: File
): Promise<string> {
	const token = useAuthStore.getState().token;
	const formData = new FormData();
	formData.append("file", file);

	const res = await fetch(`http://localhost:8080/bizbridge/${role}/upload-photo`, {
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
		url = `http://localhost:8080/bizbridge${url}`;
	}
	return data.url;
}

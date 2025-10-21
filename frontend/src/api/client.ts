import { useAuthStore } from "../store/auth";

export async function apiFetch<T>(
	url: string,
	options: RequestInit = {}
): Promise<T> {
	const token = useAuthStore.getState().token;

	const headers: Record<string, string> = {
		...(options.headers instanceof Headers
			? Object.fromEntries(options.headers.entries())
			: (options.headers as Record<string, string> | undefined) || {}),
	};
	if (!(options.body instanceof FormData)) {
		headers["Content-Type"] = "application/json";
	}

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}


	const res = await fetch(`http://localhost:8080${url}`, {
		...options,
		headers,
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Fetch error ${res.status}: ${text}`);
	}
	const contentType = res.headers.get("content-type");
	if (contentType && contentType.includes("application/json")) {
		const data = await res.json();
		return normalizeUrls(data) as T;
	} else {
		// return plain text, blob, etc.
		return (await res.text()) as unknown as T;
	}
}

function normalizeUrls(obj: any): any {
	if (!obj || typeof obj !== "object") return obj;
	if (Array.isArray(obj)) return obj.map(normalizeUrls);

	const newObj: any = {};
	for (const [key, value] of Object.entries(obj)) {
		if (
			typeof value === "string" &&
			(key.toLowerCase().includes("url") || key.toLowerCase().includes("photo"))
		) {
			console.log("Before normalization:", key, value);
			if (value.startsWith("/") && !value.startsWith("http")) {
				newObj[key] = `http://localhost:8080/bizbridge${value}`;
			} else {
				newObj[key] = value;
			}
			console.log("After normalization:", newObj[key]);
		} else {
			newObj[key] = normalizeUrls(value);
		}
	}
	return newObj;
}

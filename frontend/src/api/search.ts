import { apiFetch } from "./client";
import type { Company } from "../store/auth";

export async function searchCompanies(name: string): Promise<Company[]> {
	const params = new URLSearchParams();
	params.append("sector", name)
	params.append("name", name)
	return apiFetch<Company[]>(`/search?${params}`)
}

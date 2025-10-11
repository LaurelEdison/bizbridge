import { apiFetch } from "./client";
import type { Company } from "../store/auth";

export async function searchCompanies(sector?: string, name?: string): Promise<Company[]> {
	const params = new URLSearchParams();
	if (sector) params.append("sector", sector)
	if (name) params.append("name", name)
	return apiFetch<Company[]>(`/bizbridge/search?${params}`)
}

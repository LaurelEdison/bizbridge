import { apiFetch } from "./client";
import type { Sector } from "../store/sectorStore";

export async function getAllSectors(): Promise<Sector[]> {
	return apiFetch("/bizbridge/sector");
}

export async function getCompanySectors(companyID: string): Promise<Sector[]> {
	return apiFetch(`/bizbridge/company/${companyID}/sector`);
}

export async function addCompanySector(sectorID: string): Promise<void> {
	await apiFetch(`/bizbridge/company/sector`, {
		method: "POST",
		body: JSON.stringify({ sector_id: sectorID }),
	});
}

export async function removeCompanySector(companyID: string, sectorID: string): Promise<void> {
	await apiFetch(`/bizbridge/company/${companyID}/${sectorID}`, {
		method: "DELETE",
	});
}

import { apiFetch } from "./client";
import type { Sector } from "../store/sectorStore";

export async function getAllSectors(): Promise<Sector[]> {
  return apiFetch("/sector");
}

export async function getCompanySectors(companyID: string): Promise<Sector[]> {
  return apiFetch(`/company/${companyID}/sector`);
}

export async function addCompanySector(sectorID: string): Promise<void> {
  await apiFetch(`/company/sector`, {
    method: "POST",
    body: JSON.stringify({ sector_id: sectorID }),
  });
}

export async function removeCompanySector(
  companyID: string,
  sectorID: string,
): Promise<void> {
  await apiFetch(`/company/${companyID}/${sectorID}`, {
    method: "DELETE",
  });
}

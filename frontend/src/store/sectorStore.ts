import { create } from "zustand";
import { getAllSectors, getCompanySectors, addCompanySector, removeCompanySector } from "../api/sector";

export type Sector = {
	id: string;
	name: string;
};

export type SectorProfile = {
	company_id: string;
	sector_id: string;
};

type SectorState = {
	sectors: Sector[];
	companySectors: Sector[];
	loading: boolean;
	error: string | null;

	fetchSectors: () => Promise<void>;
	fetchCompanySectors: (companyID: string) => Promise<void>;
	addCompanySector: (companyID: string, sectorID: string) => Promise<void>;
	removeCompanySector: (companyID: string, sectorID: string) => Promise<void>;
};

export const useSectorStore = create<SectorState>((set, get) => ({
	sectors: [],
	companySectors: [],
	loading: false,
	error: null,

	fetchSectors: async () => {
		set({ loading: true, error: null });
		try {
			const sectors = await getAllSectors();
			set({ sectors, loading: false });
		} catch (err) {
			set({ error: "Failed to fetch sectors", loading: false });
		}
	},

	fetchCompanySectors: async (companyID) => {
		set({ loading: true, error: null });
		try {
			const companySectors = await getCompanySectors(companyID);
			set({ companySectors, loading: false });
		} catch (err) {
			set({ error: "Failed to fetch company sectors", loading: false });
		}
	},

	addCompanySector: async (companyID, sectorID) => {
		await addCompanySector(sectorID);
		await get().fetchCompanySectors(companyID);
	},

	removeCompanySector: async (companyID, sectorID) => {
		await removeCompanySector(companyID, sectorID);
		set((state) => ({
			companySectors: state.companySectors.filter((s) => s.id !== sectorID),
		}));
	},
}));

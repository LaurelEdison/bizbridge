import { create } from "zustand";
import {
  getCompanyBanners,
  getCustomerBanners,
  uploadCompanyBanners,
} from "../api/banner";

export type Role = "customer" | "company";

export type CompanyBanner = {
  id: string;
  company_id: string;
  file_name: string;
  url: string;
  uploaded_at: string;
};

export type CustomerBanner = {
  id: string;
  customer_id: string;
  file_name: string;
  url: string;
  uploaded_at: string;
};

export type fileResponse = {
  filename: string;
  url: string;
};

export type BannerState = {
  banners: Array<CustomerBanner | CompanyBanner>;
  loading: boolean;
  error: string | null;
  clearError: () => void;

  fetchBanners: (id: string, role: Role) => Promise<void>;
  uploadBanners: (role: Role, files: File[]) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
};

export const useBannerStore = create<BannerState>((set) => ({
  banners: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchBanners: async (id, role) => {
    set({ loading: true, error: null });
    try {
      const banners =
        role === "company"
          ? await getCompanyBanners(id)
          : await getCustomerBanners(id);

      set({ banners, loading: false });
    } catch (err: any) {
      console.error("Failed to fetch banners", err);
      set({ error: err.message ?? "Failed to fetch", loading: false });
    }
  },

  uploadBanners: async (role, files) => {
    set({ loading: true, error: null });
    try {
      let uploaded: fileResponse[] = [];

      if (role === "company") {
        uploaded = await uploadCompanyBanners(files);
      } else {
        // placeholder for uploadCustomerBanners if implemented later
      }

      // Normalize and merge results with current banners
      const newBanners = uploaded.map((f) => ({
        id: crypto.randomUUID(),
        file_name: f.filename,
        url: f.url,
        company_id: role === "company" ? "TEMP" : "",
        customer_id: role === "customer" ? "TEMP" : "",
        uploaded_at: new Date().toISOString(),
      }));

      set((state) => ({
        banners: [...state.banners, ...newBanners],
        loading: false,
      }));
    } catch (err: any) {
      console.error("Upload failed", err);
      set({ error: err.message ?? "Upload failed", loading: false });
    }
  },

  deleteBanner: async (id) => {
    try {
      // API call placeholder (e.g., await deleteBannerApi(id))
      set((state) => ({
        banners: state.banners.filter((b) => b.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message ?? "Delete failed" });
    }
  },
}));

import { create } from "zustand";
import {
  getCompanyFiles,
  getCustomerFiles,
  uploadCompanyFiles,
} from "../api/file";

type Role = "customer" | "company";

export type CustomerFile = {
  id: string;
  customer_id: string;
  category: string;
  file_name: string;
  url: string;
  uploaded_at: string;
};
export type CompanyFile = {
  id: string;
  customer_id: string;
  category: string;
  file_name: string;
  url: string;
  uploaded_at: string;
};
export type fileResponse = {
  filename: string;
  url: string;
};
export type FileState = {
  files: Array<CustomerFile | CompanyFile>;
  loading: boolean;
  error: string | null;
  uploadFiles: (role: Role, files: File[], category: string) => void;
  fetchFiles: (id: string, role: Role) => void;
  deleteFile: (id: string) => void;
  clearError: () => void;
};

export const useFileStore = create<FileState>((set) => ({
  files: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchFiles: async (id, role) => {
    set({ loading: true, error: null });
    try {
      const files =
        role === "company"
          ? await getCompanyFiles(id)
          : await getCustomerFiles(id);
      set({ files, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  uploadFiles: async (role, files, category) => {
    set({ loading: true, error: null });
    try {
      let uploaded: fileResponse[] = [];

      if (role === "company") {
        uploaded = await uploadCompanyFiles(files);
      } else {
        // implement uploadCustomerFiles() similarly
        // or skip if not ready yet
      }

      // merge into current files list
      const newFiles = uploaded.map((u) => ({
        id: crypto.randomUUID(),
        category,
        file_name: u.filename,
        url: u.url,
        customer_id: role === "customer" ? "TEMP" : "",
        company_id: role === "company" ? "TEMP" : "",
        uploaded_at: new Date().toISOString(),
      }));

      set((state) => ({
        files: [...state.files, ...newFiles],
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  deleteFile: async (id) => {
    try {
      // API call placeholder
      // await deleteFileApi(id)
      set((state) => ({
        files: state.files.filter((f) => f.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));

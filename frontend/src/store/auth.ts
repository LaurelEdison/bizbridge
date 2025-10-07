import { create } from 'zustand'

export type Customer = {
	id: string;
	name: string;
	email: string;
	country: string;
	description: string | null;
	photourl: string | null;
}

export type Company = {
	id: string;
	name: string;
	email: string;
	address: string;
	description: string | null;
	photourl: string | null;
	username: string | null;
}


type AuthState = {
	token: string | null;
	setToken: (token: string | null) => void;
	role: "customer" | "company" | null;
	setRole: (role: "customer" | "company" | null) => void;
	customer: Customer | null;
	setCustomer: (c: Customer | null) => void;
	company: Company | null;
	setCompany: (c: Company | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	token: null,
	setToken: (token) => set({ token }),
	role: null,
	setRole: (role) => set({ role }),
	customer: null,
	setCustomer: (c) => set({ customer: c }),
	company: null,
	setCompany: (c) => set({ company: c })
}))



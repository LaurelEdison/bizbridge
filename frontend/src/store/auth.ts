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
};

export const useAuthStore = create<AuthState>((set) => ({
	token: null,
	setToken: (token) => set({ token }),
}))

import { create } from "zustand";
import { completeOrder, createOrder, depositFunds, getWallet, refundOrder, getOrders } from "../api/payment";

export type NullString = { String: string; Valid: boolean };
export type NullUUID = { String: string; Valid: boolean };
export type NullTime = { Time: string; Valid: boolean };

export type Wallet = {
	id: string;
	owner_role: string;
	owner_id: string;
	balance: string;
	currency: string;
	create_at: string;
	updated_at: string;
};

export type EscrowAccount = {
	id: string;
	investor_id: string;
	business_id: string;
	amount: string;
	status: string;
	created_at: string;
	updated_at: string;
	released_at: NullTime;
};

export type Order = {
	id: string;
	customer_id: string;
	customer_name: string;
	company_id: string;
	company_name: string;
	escrow_id: NullUUID;
	total_amount: string;
	status: string;
	description: NullString;
	created_at: string;
	updated_at: string;
};

export type CreateOrderResponse = {
	order: Order;
	escrow: EscrowAccount;
};

type PaymentState = {
	wallet: Wallet | null;
	orders: Order[];
	escrows: Record<string, EscrowAccount>; // keyed by escrow.id
	loading: boolean;
	error: string | null;

	fetchWallet: () => Promise<void>;
	deposit: (amount: number) => Promise<void>;
	createOrder: (recipient_id: string, amount: number, description: string) => Promise<void>;
	completeOrder: (order_id: string) => Promise<void>;
	refundOrder: (order_id: string) => Promise<void>;
};

export const usePaymentStore = create<PaymentState>((set) => ({
	wallet: null,
	orders: [],
	escrows: {},
	loading: false,
	error: null,

	fetchWallet: async () => {
		set({ loading: true, error: null });
		try {
			const wallet = await getWallet();
			set({ wallet, loading: false });
		} catch (err: any) {
			set({ error: err.message || "Failed to fetch wallet", loading: false });
		}
	},

	fetchOrders: async () => {
		set({ loading: true, error: null });
		try {
			const orders = await getOrders();
			set({ orders, loading: false });
		} catch (err: any) {
			set({ error: err.message || "Failed to fetch orders", loading: false });
		}
	},

	deposit: async (amount: number) => {
		set({ loading: true, error: null });
		try {
			const wallet = await depositFunds(amount);
			set({ wallet, loading: false });
		} catch (err: any) {
			set({ error: err.message || "Deposit failed", loading: false });
		}
	},

	createOrder: async (recipient_id, amount, description) => {
		set({ loading: true, error: null });
		try {
			const { order, escrow } = await createOrder(recipient_id, amount, description);
			set((state) => ({
				orders: [...state.orders, order],
				escrows: { ...state.escrows, [escrow.id]: escrow },
				loading: false,
			}));
		} catch (err: any) {
			set({ error: err.message || "Order creation failed", loading: false });
		}
	},

	completeOrder: async (order_id) => {
		set({ loading: true, error: null });
		try {
			const { order, escrow } = await completeOrder(order_id);
			set((state) => ({
				orders: state.orders.map((o) => (o.id === order.id ? order : o)),
				escrows: { ...state.escrows, [escrow.id]: escrow },
				loading: false,
			}));
		} catch (err: any) {
			set({ error: err.message || "Order completion failed", loading: false });
		}
	},

	refundOrder: async (order_id) => {
		set({ loading: true, error: null });
		try {
			const { order, escrow } = await refundOrder(order_id);
			set((state) => ({
				orders: state.orders.map((o) => (o.id === order.id ? order : o)),
				escrows: { ...state.escrows, [escrow.id]: escrow },
				loading: false,
			}));
		} catch (err: any) {
			set({ error: err.message || "Refund failed", loading: false });
		}
	},
}));

import { apiFetch } from "./client";
import type { Wallet, CreateOrderResponse, Order } from "../store/paymentStore";

export async function getWallet(): Promise<Wallet> {
	return apiFetch<Wallet>(`/wallet`);
}
export async function depositFunds(amount: number): Promise<Wallet> {
	return apiFetch<Wallet>(`/wallet/deposit`, {
		method: "POST",
		body: JSON.stringify({ amount })
	});
}

export async function getOrders(): Promise<Order[]> {
	return apiFetch<Order[]>(`/order/all`);
}

export async function createOrder(recipient_id: string,
	amount: number, description: string): Promise<CreateOrderResponse> {
	return apiFetch<CreateOrderResponse>(`/order`, {
		method: "POST",
		body: JSON.stringify({ recipient_id, amount, description })
	});
}

export async function completeOrder(order_id: string): Promise<CreateOrderResponse> {
	return apiFetch<CreateOrderResponse>(`/order/complete`, {
		method: "POST",
		body: JSON.stringify({ order_id })
	});
}

export async function refundOrder(order_id: string): Promise<CreateOrderResponse> {
	return apiFetch<CreateOrderResponse>(`/order/refund`, {
		method: "POST",
		body: JSON.stringify({ order_id })
	});
}


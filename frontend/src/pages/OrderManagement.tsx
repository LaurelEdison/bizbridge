import { useEffect, useState } from "react";
import type { Order } from "../store/paymentStore";
import { completeOrder, getOrders, refundOrder } from "../api/payment";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchOrders = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getOrders();
			setOrders(data);
		} catch (err: any) {
			setError(err.message || "Failed to load orders");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const handleAction = async (
		order_id: string,
		action: "complete" | "refund"
	) => {
		setActionLoading(order_id);
		try {
			if (action === "complete") await completeOrder(order_id);
			else await refundOrder(order_id);

			await fetchOrders();
		} catch (err: any) {
			alert(err.message || `Failed to ${action} order`);
		} finally {
			setActionLoading(null);
		}
	};
	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
			<Navbar />

			<main className="flex flex-1 min-h-screen flex-col p-8 pt-6 overflow-y-auto">
				<div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6">
					<h1 className="text-2xl font-semibold text-[#094233] mb-6">
						Manage Orders
					</h1>

					{loading ? (
						<p className="text-gray-500">Loading orders...</p>
					) : error ? (
						<p className="text-red-500">{error}</p>
					) : orders.length === 0 ? (
						<p className="text-gray-500 text-center py-6">
							No orders found.
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-[#094233] text-white">
										<th className="px-4 py-2 text-left">ID</th>
										<th className="px-4 py-2 text-left">Customer</th>
										<th className="px-4 py-2 text-left">Company</th>
										<th className="px-4 py-2 text-left">Amount</th>
										<th className="px-4 py-2 text-left">Status</th>
										<th className="px-4 py-2 text-center">Actions</th>
									</tr>
								</thead>
								<tbody>
									{orders.map((o) => (
										<tr
											key={o.id}
											className="border-b border-gray-200 hover:bg-gray-50 transition"
										>
											<td className="px-4 py-2 font-mono text-xs text-gray-600">
												{o.id.slice(0, 8)}...
											</td>
											<td className="px-4 py-2 text-sm text-gray-700">
												{o.customer_id}
											</td>
											<td className="px-4 py-2 text-sm text-gray-700">
												{o.company_id}
											</td>
											<td className="px-4 py-2 text-sm text-gray-800 font-semibold">
												${parseFloat(o.total_amount).toLocaleString()}
											</td>
											<td className="px-4 py-2 text-sm">
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${o.status === "completed"
														? "bg-green-100 text-green-700"
														: o.status === "refunded"
															? "bg-red-100 text-red-700"
															: "bg-yellow-100 text-yellow-700"
														}`}
												>
													{o.status}
												</span>
											</td>
											<td className="px-4 py-2 flex gap-2 justify-center">
												{(o.status === "pending" ||
													o.status === "in_progress") && (
														<>
															<button
																onClick={() =>
																	handleAction(o.id, "complete")
																}
																disabled={actionLoading === o.id}
																className="bg-[#094233] hover:bg-[#0b523e] text-white px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50"
															>
																{actionLoading === o.id
																	? "Processing..."
																	: "Complete"}
															</button>
															<button
																onClick={() =>
																	handleAction(o.id, "refund")
																}
																disabled={actionLoading === o.id}
																className="bg-[rgba(252,204,98,1)] hover:bg-yellow-400 text-[#094233] px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50"
															>
																Refund
															</button>
														</>
													)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}

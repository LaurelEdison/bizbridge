import { useEffect, useState } from "react";
import { usePaymentStore } from "../store/paymentStore";

export default function WalletMenu() {
	const { wallet, fetchWallet, deposit } = usePaymentStore();
	const [isOpen, setIsOpen] = useState(false);
	const [showDeposit, setShowDeposit] = useState(false);
	const [amount, setAmount] = useState("");

	useEffect(() => {
		if (!wallet) fetchWallet();
	}, [wallet, fetchWallet]);

	const handleDeposit = async () => {
		const num = parseFloat(amount);
		if (isNaN(num) || num <= 0) {
			alert("Please enter a valid amount");
			return;
		}
		await deposit(num);
		setShowDeposit(false);
		setAmount("");
	};

	return (
		<div className="relative">
			{/* Wallet Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-4 py-2 bg-[#0b523e] text-white rounded-lg hover:bg-[#0f604a] transition"
			>
				💰
				<span className="font-semibold">
					{wallet ? `${wallet.balance} ${wallet.currency}` : "Loading..."}
				</span>
				<svg
					className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{/* Dropdown */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-[#0e3d2e] text-white border border-[#136b4f] rounded-lg shadow-lg z-20">
					<button
						onClick={() => {
							setShowDeposit(true);
							setIsOpen(false);
						}}
						className="w-full text-left px-4 py-2 hover:bg-[#145c46] transition-colors"
					>
						Deposit Funds
					</button>
				</div>
			)}

			{/* Deposit Modal */}
			{showDeposit && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-30">
					<div className="bg-[#0e3d2e] rounded-xl shadow-2xl p-6 w-96 border border-[#146b50] text-white">
						<h2 className="text-xl font-semibold mb-4 text-[rgba(252,204,98,1)]">
							Deposit Funds
						</h2>
						<input
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Enter amount"
							className="w-full px-3 py-2 text-[#094233] bg-[#fdfaf3] border border-[#c6b98a] rounded-md mb-4 focus:ring-2 focus:ring-[rgba(252,204,98,0.8)] focus:outline-none"
						/>
						<div className="flex justify-end gap-3">
							<button
								onClick={() => setShowDeposit(false)}
								className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition"
							>
								Cancel
							</button>
							<button
								onClick={handleDeposit}
								className="px-4 py-2 rounded-md bg-[#198754] text-white font-medium hover:bg-[#157347] transition"
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}

		</div>
	);
}

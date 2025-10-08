import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CompanyLogin from "../components/CompanyLogin";
import CustomerLogin from "../components/CustomerLogin";
import { Navbar } from "../components/Navbar";

export default function Login() {
	const [mode, setMode] = useState<"customer" | "company">("customer");
	const switchMode = () => setMode(mode === "customer" ? "company" : "customer");

	return (
		<>
			<Navbar />
			<div className="flex h-screen w-full overflow-hidden">
				<div className={`flex-1 flex items-center justify-center ${mode === "customer" ? "bg-blue-50" : "bg-gray-200"}`}>
					<AnimatePresence mode="wait">
						{mode === "customer" && (
							<motion.div
								key="customer"
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 50 }}
								transition={{ duration: 0.5 }}
							>
								<h2 className="text-2xl font-bold mb-4 text-blue-700">Customer Login</h2>
								<CustomerLogin />
								<button className="mt-4 text-blue-600 hover:underline" onClick={switchMode}>
									Switch to Company login
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<div className={`flex-1 flex items-center justify-center ${mode === "company" ? "bg-indigo-50" : "bg-gray-200"}`}>
					<AnimatePresence mode="wait">
						{mode === "company" && (
							<motion.div
								key="company"
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -50 }}
								transition={{ duration: 0.5 }}
							>
								<h2 className="text-2xl font-bold mb-4 text-indigo-700">Company Login</h2>
								<CompanyLogin />
								<button className="mt-4 text-indigo-600 hover:underline" onClick={switchMode}>
									Switch to Customer login
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</>
	)
}

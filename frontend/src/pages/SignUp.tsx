import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomerSignup from "../components/CustomerSignup";
import CompanySignup from "../components/CompanySignup";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";

export default function Signup() {
	const [mode, setMode] = useState<"customer" | "company">("customer");
	const switchMode = () => setMode(mode === "customer" ? "company" : "customer");

	return (
		<div className="flex flex-col min-h-screen w-full overflow-x-hidden font-[Inria_Serif] bg-[#f9fafb] text-[#2d3748]">
			<Navbar />

			<main className="flex-1 min-h-screen flex items-center justify-center px-6 py-12 overflow-y-auto">
				<div className="w-full max-w-5xl flex rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-100">

					<div
						className={`flex-1 flex items-center justify-center transition-colors duration-500 ${mode === "customer" ? "bg-[#fdf6ec]" : "bg-[#f1f5f4]"
							}`}
					>
						<AnimatePresence mode="wait">
							{mode === "customer" && (
								<motion.div
									key="customer"
									initial={{ opacity: 0, x: -60 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 60 }}
									transition={{ duration: 0.5 }}
									className="flex flex-col justify-center items-center text-center p-10 min-h-[650px] w-full"
								>
									<h2 className="text-3xl font-bold mb-3 text-[#094233]">
										Customer Signup
									</h2>
									<p className="text-gray-600 mb-8 text-lg">
										Join BizBridge and discover trusted Indonesian businesses.
									</p>
									<div className="w-full max-w-sm">
										<CustomerSignup />
									</div>
									<button
										onClick={switchMode}
										className="mt-8 px-8 py-3 bg-[#094233] text-white rounded-[30px] hover:bg-[#276749] transition font-medium shadow-md"
									>
										Switch to Company Signup
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					<div
						className={`flex-1 flex items-center justify-center transition-colors duration-500 ${mode === "company" ? "bg-[#e9f5ee]" : "bg-[#f1f5f4]"
							}`}
					>
						<AnimatePresence mode="wait">
							{mode === "company" && (
								<motion.div
									key="company"
									initial={{ opacity: 0, x: 60 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -60 }}
									transition={{ duration: 0.5 }}
									className="flex flex-col justify-center items-center text-center p-10 min-h-[650px] w-full"
								>
									<h2 className="text-3xl font-bold mb-3 text-[#094233]">
										Company Signup
									</h2>
									<p className="text-gray-600 mb-8 text-lg">
										Showcase your business and connect with global customers.
									</p>
									<div className="w-full max-w-sm">
										<CompanySignup />
									</div>
									<button
										onClick={switchMode}
										className="mt-8 px-8 py-3 bg-[#094233] text-white rounded-[30px] hover:bg-[#276749] transition font-medium shadow-md"
									>
										Switch to Customer Signup
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}

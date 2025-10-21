import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CompanyLogin from "../components/CompanyLogin";
import CustomerLogin from "../components/CustomerLogin";
import { Navbar } from "../components/Navbar";

import loginImage1 from "../assets/loginCarousel1.png"
import loginImage2 from "../assets/loginCarousel2.png"

export default function Login() {
	const [mode, setMode] = useState<"customer" | "company">("customer");
	const switchMode = () => setMode(mode === "customer" ? "company" : "customer");

	return (
		<div className="flex flex-col min-h-screen w-full overflow-hidden font-[Inria_Serif] text-[#2d3748]">
			<Navbar />

			<div className="flex flex-1">
				<div
					className={`relative flex-1 flex items-center justify-center transition-colors duration-500 ${mode === "customer" ? "bg-[#e6f4ea]" : "bg-[#f2f2f2]"
						}`}
				>
					<AnimatePresence>
						{mode === "company" && (
							<motion.div
								key="left-image"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.6 }}
								className="absolute inset-0"
							>
								<img
									src={loginImage2}
									alt="Customer side"
									className="w-full h-full object-cover"
								/>
								{/* optional subtle overlay for text contrast */}
								<div className="absolute inset-0 bg-white/20" />
							</motion.div>
						)}
					</AnimatePresence>

					<AnimatePresence mode="wait">
						{mode === "customer" && (
							<motion.div
								key="customer"
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 50 }}
								transition={{ duration: 0.5 }}
								className="text-center relative z-10"
							>
								<h2 className="text-3xl font-bold mb-4 text-[#094233]">Customer Login</h2>
								<CustomerLogin />
								<button
									onClick={switchMode}
									className="mt-6 px-8 py-3 bg-[#094233] text-white rounded-[30px] hover:bg-[#276749] transition font-medium"
								>
									Switch to Company Login
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<div
					className={`relative flex-1 flex items-center justify-center transition-colors duration-500 ${mode === "company" ? "bg-[#cde3d1]" : "bg-[#f2f2f2]"
						}`}
				>
					<AnimatePresence>
						{mode === "customer" && (
							<motion.div
								key="right-image"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.6 }}
								className="absolute inset-0"
							>
								<img
									src={loginImage1}
									alt="Company side"
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-white/20" />
							</motion.div>
						)}
					</AnimatePresence>

					<AnimatePresence mode="wait">
						{mode === "company" && (
							<motion.div
								key="company"
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -50 }}
								transition={{ duration: 0.5 }}
								className="text-center relative z-10"
							>
								<h2 className="text-3xl font-bold mb-4 text-[#094233]">Company Login</h2>
								<CompanyLogin />
								<button
									onClick={switchMode}
									className="mt-6 px-8 py-3 bg-[#094233] text-white rounded-[30px] hover:bg-[#276749] transition font-medium"
								>
									Switch to Customer Login
								</button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}

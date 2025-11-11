import { useAuthStore } from "../store/auth";
import logo from "../assets/logoPutih.png"
import WalletMenu from "./WalletMenu";

export function Navbar() {
	const { token, role, logout } = useAuthStore();

	return (
		<nav className="w-full flex justify-between items-center px-8 py-4 bg-[#094233] shadow-md sticky top-0 z-50">
			<a href="/" className="flex items-center gap-3">
				<img
					src={logo}
					alt="BizBridge Logo"
					className="h-12 w-auto object-contain"
				/>

			</a>
			<div className="flex items-center gap-6 text-white text-lg font-medium">
				{!token ? (
					<>
						<a
							href="/login"
							className="hover:text-[rgba(252,204,98,1)] transition"
						>
							Login
						</a>
						<a
							href="/register"
							className="px-4 py-2 bg-[rgba(252,204,98,1)] text-[#094233] rounded-full font-semibold hover:bg-yellow-300 transition"
						>
							Sign Up
						</a>
					</>
				) : role === "customer" ? (
					<>
						<WalletMenu />
						<a
							href="/search"
							className="hover:text-[rgba(252,204,98,1)] transition"
						>
							Search
						</a>
						<a
							href="/order"
							className="hover:text-[rgba(252,204,98,1)] transition"
						>
							Orders
						</a>
						<a
							href="/chat"
							className="hover:text-[rgba(252,204,98,1)] transition"
						>
							Chat
						</a>
						<a
							href="/profile"
							className="hover:text-[rgba(252,204,98,1)] transition"
						>
							Profile
						</a>
						<button
							onClick={() => {
								logout();
								window.location.href = "/";
							}}
							className="px-4 py-2 bg-white text-[#094233] rounded-full font-semibold hover:bg-gray-200 transition"
						>
							Logout
						</button>
					</>
				) : role === "company" ? (
					<>
						<WalletMenu />
						<a
							href="/order"
							className="hover:text-[rgba(252,204,98,1)] transition"
						>
							Orders
						</a>
						<a
							href="/chat"
							className="hover:text-[rgba(252,204,98,1)] transition"
						>
							Chat
						</a>
						<a
							href="/profile"
							className="hover:text-[rgba(252,204,98,1)] transition"
						>
							Profile
						</a>
						<button
							onClick={() => {
								logout();
								window.location.href = "/";
							}}
							className="px-4 py-2 bg-white text-[#094233] rounded-full font-semibold hover:bg-gray-200 transition"
						>
							Logout
						</button>
					</>
				) : null}
			</div>
		</nav>
	);
}

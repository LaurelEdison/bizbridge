import { useAuthStore } from "../store/auth";

export function Navbar() {
	const { token, role, logout } = useAuthStore();

	return (
		<nav className="w-full flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">
			<h1 className="text-2xl font-bold text-blue-600 tracking-tight">BizBridge</h1>

			<div className="flex items-center gap-4">
				{!token ? (
					<>
						<a
							href="/login"
							className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800 transition"
						>
							Login
						</a>
						<a
							href="/register"
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						>
							Sign Up
						</a>
					</>
				) : role === "customer" ? (
					<>
						<a
							href="/chat"
							className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800 transition"
						>
							Chat
						</a>
						<a
							href="/search"
							className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800 transition"
						>
							Search
						</a>
						<a
							href="/profile"
							className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800 transition"
						>
							Profile
						</a>
						<button
							onClick={() => {
								logout();
								window.location.href = "/";
							}}
							className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
						>
							Logout
						</button>
					</>
				) : role === "company" ? (
					<>
						<a
							href="/chat"
							className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800 transition"
						>
							Chat
						</a>
						<a
							href="/profile"
							className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800 transition"
						>
							Profile
						</a>
						<button
							onClick={() => {
								logout();
								window.location.href = "/";
							}}
							className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
						>
							Logout
						</button>
					</>
				) : null}
			</div>
		</nav>
	);
}

import { useAuthStore } from "../store/auth";

export function Navbar() {
	const token = useAuthStore((s) => s.token)
	const role = useAuthStore((s) => s.role)
	return (
		<nav className="w-full flex justify-between items-center px-8 py-4 bg-white shadow-md">
			<h1 className="text-2xl font-bold text-blue-600">BizBridge</h1>
			{!token ? (
				<>
					<a
						href="/login"
						className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800"
					>
						Login
					</a>
					<a
						href="/register"
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Sign Up
					</a>
				</>
			) : role === "customer" ? (
				<>
					<a
						href="/chat"
						className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800"
					>
						Chat
					</a>

				</>

			) : role === "company" ? (
				<>
					<a
						href="/chat"
						className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800"
					>
						Chat
					</a>
				</>

			) : null}
		</nav>
	);
}

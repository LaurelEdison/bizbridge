import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { apiFetch } from "../api/client";
import type { Company } from "../store/auth";

// TODO: Switch to access+refresh token
export default function CompanyLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const setToken = useAuthStore((s) => s.setToken);

	async function handleCompanyLogin(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const data = await apiFetch<{ token: string }>("/company/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
			});
			setToken(data.token);

			useAuthStore.getState().setRole("company");

			const company = await apiFetch<Company>("/company/me");
			useAuthStore.getState().setCompany(company);

			window.location.href = "/";
		} catch (err) {
			console.error("Login failed", err);
			setError("Invalid email or password. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form
			onSubmit={handleCompanyLogin}
			className="flex flex-col gap-5 w-full max-w-sm bg-white shadow-md rounded-2xl p-8 border border-gray-100"
		>
			<h2 className="text-2xl font-semibold text-[#094233] text-center mb-2">
				Welcome Back, Partner!
			</h2>
			<p className="text-gray-600 text-center text-sm mb-4">
				Log in to manage your company profile and connect with clients.
			</p>

			<input
				className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#094233] transition"
				placeholder="Email"
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>

			<input
				className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#094233] transition"
				placeholder="Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>

			{error && <p className="text-red-500 text-sm text-center">{error}</p>}
			<button
				type="submit"
				disabled={loading || !email.trim() || !password.trim()}
				className={`mt-2 py-3 rounded-full text-white font-semibold transition
    ${loading || !email.trim() || !password.trim()
						? "bg-gray-400 cursor-not-allowed"
						: "bg-[#094233] hover:bg-[#276749]"
					}`}
			>
				{loading ? "Logging in..." : "Login"}
			</button>
		</form>
	);
}

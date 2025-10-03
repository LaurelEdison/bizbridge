import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { apiFetch } from "../api/client";
//TODO: Switch to access+refresh token
export default function CompanyLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const setToken = useAuthStore((s) => s.setToken);
	async function handleCompanyLogin(e: React.FormEvent) {
		e.preventDefault();
		try {
			const data = await apiFetch<{ token: string }>("/bizbridge/company/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
			});
			setToken(data.token);
			console.log(data.token);


		} catch (err) {
			console.error("Login failed", err);
		}
	}
	return (
		< div className="flex flex-col items-center justify-center h-screen" >
			<form onSubmit={handleCompanyLogin} className="flex flex-col gap-2">
				<input
					className="border p-2"
					placeholder="email"
					value={email}
					onChange={(s) => setEmail(s.target.value)}
				/>
				<input
					className="border p-2"
					placeholder="Password"
					type="password"
					value={password}
					onChange={(s) => setPassword(s.target.value)}
				/>
				<button className="bg-blue-500 text-white p-2 rounded" type="submit">
					Login
				</button>
			</form>
		</div >
	);
}


import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { apiFetch } from "../api/client";
import { SectorSelector } from "./SectorSelector";
import type { Company } from "../store/auth";
import { addCompanySector } from "../api/sector";
//TODO: Switch to access+refresh token
export default function CompanySignup() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [address, setAddress] = useState("");
	const [selectedSectors, setSelectedSectors] = useState<string[]>([])
	const setToken = useAuthStore((s) => s.setToken);
	async function handleCompanySignup(e: React.FormEvent) {
		e.preventDefault();
		try {
			const company = await apiFetch<Company>("/bizbridge/company", {
				method: "POST",
				body: JSON.stringify({ name, email, password, address }),
			});
			const data = await apiFetch<{ token: string }>("/bizbridge/company/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
			});
			setToken(data.token);
			console.log(data.token);

			const role = "company";
			useAuthStore.getState().setRole(role);
			useAuthStore.getState().setCompany(company);
			for (const sectorID of selectedSectors) {
				await addCompanySector(sectorID);
			}
			window.location.href = "/";

		} catch (err) {
			console.error("Login failed", err);
		}
	}
	return (
		<form onSubmit={handleCompanySignup} className="flex flex-col gap-4 w-full max-w-sm">
			<input
				className="border p-2"
				placeholder="Name"
				value={name}
				onChange={(s) => setName(s.target.value)}
			/>
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
			<input
				className="border p-2"
				placeholder="Address"
				value={address}
				onChange={(s) => setAddress(s.target.value)}
			/>
			<SectorSelector onChange={setSelectedSectors} selected={selectedSectors} />
			<button className="bg-blue-500 text-white p-2 rounded" type="submit">
				Sign up!
			</button>
		</form>
	);
}


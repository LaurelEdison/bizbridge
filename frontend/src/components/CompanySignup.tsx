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
	const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
	const setToken = useAuthStore((s) => s.setToken);

	async function handleCompanySignup(e: React.FormEvent) {
		e.preventDefault();
		try {
			const company = await apiFetch<Company>("/company", {
				method: "POST",
				body: JSON.stringify({ name, email, password, address }),
			});
			const data = await apiFetch<{ token: string }>("/company/login", {
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
		<form
			onSubmit={handleCompanySignup}
			className="flex flex-col gap-4 w-full max-w-md p-8 bg-white rounded-2xl shadow-md border border-gray-100"
		>
			<h2 className="text-2xl font-semibold text-center text-indigo-700">
				Company Sign Up
			</h2>

			<input
				className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
				placeholder="Name"
				value={name}
				onChange={(s) => setName(s.target.value)}
			/>
			<input
				className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
				placeholder="Email"
				value={email}
				onChange={(s) => setEmail(s.target.value)}
			/>
			<input
				className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
				placeholder="Password"
				type="password"
				value={password}
				onChange={(s) => setPassword(s.target.value)}
			/>
			<input
				className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
				placeholder="Address"
				value={address}
				onChange={(s) => setAddress(s.target.value)}
			/>

			<div className="mt-2">
				<SectorSelector onChange={setSelectedSectors} selected={selectedSectors} />
			</div>

			<button
				className="mt-4 bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-transform duration-150 shadow-sm"
				type="submit"
			>
				Sign Up
			</button>
		</form>
	);
}

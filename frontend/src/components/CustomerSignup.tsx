import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { apiFetch } from "../api/client";
import type { Customer } from "../store/auth";
export default function CustomerSignup() {
	const [name, setName] = useState("")
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [country, setCountry] = useState("");
	const [description, setDescription] = useState("");
	const setToken = useAuthStore((s) => s.setToken);
	async function handleCustomerLogin(e: React.FormEvent) {
		e.preventDefault();
		try {
			const customer = await apiFetch<Customer>("bizbridge/customer/", {
				method: "POST",
				body: JSON.stringify({ name, email, password, country, description }),
			});
			const data = await apiFetch<{ token: string }>("/bizbridge/customer/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
			});
			setToken(data.token);
			console.log(data.token);

			const role = "customer";
			useAuthStore.getState().setRole(role);

			useAuthStore.getState().setCustomer(customer);

		} catch (err) {
			console.error("Login failed", err);
		}
	}
	return (
		<form onSubmit={handleCustomerLogin} className="flex flex-col gap-4 w-full max-w-sm">
			<input
				className="border p-2"
				placeholder="Name"
				type="name"
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
				placeholder="Description"
				type="description"
				value={description}
				onChange={(s) => setDescription(s.target.value)}
			/>
			<input
				className="border p-2"
				placeholder="Country"
				type="country"
				value={country}
				onChange={(s) => setCountry(s.target.value)}
			/>
			<button className="bg-blue-500 text-white p-2 rounded" type="submit">
				Sign Up
			</button>
		</form>
	);
}


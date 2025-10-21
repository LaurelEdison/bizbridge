import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { apiFetch } from "../api/client";
import type { Customer } from "../store/auth";

export default function CustomerSignup() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [country, setCountry] = useState("");
	const [description, setDescription] = useState("");
	const setToken = useAuthStore((s) => s.setToken);

	async function handleCustomerSignup(e: React.FormEvent) {
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
			window.location.href = "/";
		} catch (err) {
			console.error("Login failed", err);
		}
	}

	return (
		<form
			onSubmit={handleCustomerSignup}
			className="flex flex-col gap-4 w-full max-w-md p-8 bg-white rounded-2xl shadow-md border border-gray-100"
		>
			<h2 className="text-2xl font-semibold text-center text-indigo-700">
				Customer Sign Up
			</h2>

			<input
				className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
				placeholder="Name"
				type="text"
				value={name}
				onChange={(s) => setName(s.target.value)}
			/>
			<input
				className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
				placeholder="Email"
				type="email"
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
				placeholder="Description"
				type="text"
				value={description}
				onChange={(s) => setDescription(s.target.value)}
			/>
			<input
				className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
				placeholder="Country"
				type="text"
				value={country}
				onChange={(s) => setCountry(s.target.value)}
			/>

			<button
				className="mt-4 bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-transform duration-150 shadow-sm"
				type="submit"
			>
				Sign Up
			</button>
		</form>
	);
}

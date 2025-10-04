import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import type { Customer, Company } from "../store/auth";
import { apiFetch } from "../api/client";

export default function Profile() {
	const { role, customer, company, setCompany, setCustomer } = useAuthStore();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function loadProfile() {
			try {
				if (role === "customer" && !customer) {
					const customer = await apiFetch<Customer>("/bizbridge/customer/me")
					setCustomer(customer);
				}
				if (role === "company" && !company) {
					const company = await apiFetch<Company>("/bizbridge/company/me");
					setCompany(company);
				}
			} catch (err) {
				console.error("Failed to get profile", err);
			} finally {
				setLoading(false);
			}
		}
		loadProfile();
	}, [role, customer, company, setCustomer, setCompany]);
	if (loading) return <p>Loading...</p>
	if (role === "customer" && customer) {
		return (
			<div className="p-4">
				<h1 className="text-x1 font-bold">Customer Profile</h1>
				<img src={customer.photourl ?? ""} alt="Profile" className="w-24 h-24 rounded-full" />
				<p>Name: {customer.name}</p>
				<p>Email: {customer.email}</p>
				<p>Country: {customer.country}</p>
				<p>Description: {customer.description ?? "No description"}</p>
			</div>
		);
	}
	if (role === "company" && company) {
		return (
			<div className="p-4">
				<h1 className="text-x1 font-bold">Company Profile</h1>
				<img src={company.photourl ?? ""} alt="Profile" className="w-24 h-24 rounded-full" />
				<p>Name: {company.name}</p>
				<p>Email: {company.email}</p>
				<p>Address: {company.address}</p>
				<p>Description: {company.description ?? "No description"}</p>
				<p>Description: {company.username ?? company.name}</p>
			</div>
		);
	}

	return <p>No profile data</p>;
}

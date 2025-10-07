import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import type { Customer, Company } from "../store/auth";
import { apiFetch } from "../api/client";

export default function ProfileEdit() {
	const { role, customer, company, setCompany, setCustomer } = useAuthStore();
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false)
	const [formData, setFormData] = useState<Partial<Customer & Company>>({})
	useEffect(() => {
		async function loadProfile() {
			try {
				if (role === "customer" && !customer) {
					const customer = await apiFetch<Customer>("/bizbridge/customer/me")
					setCustomer(customer);
					setFormData(customer);
				}
				else if (role === "company" && !company) {
					const company = await apiFetch<Company>("/bizbridge/company/me");
					setCompany(company);
					setFormData(company);
				}
				else {
					if (role === "customer" && customer) {
						setFormData(customer)
					}
					else if (role === "company" && company) {
						setFormData(company)
					}
					else {
						setFormData({})
					}

				}

			} catch (err) {
				console.error("Failed to get profile", err);
			} finally {
				setLoading(false);
			}
		}
		loadProfile();
	}, [role, customer, company, setCustomer, setCompany]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}
	async function handleSave() {
		try {
			if (role === "customer") {
				const updated = await apiFetch<Customer>("/bizbridge/customer/update", {
					method: "PATCH",
					body: JSON.stringify(formData),
				});
				setCustomer(updated);
			}
			else if (role === "company") {
				const updated = await apiFetch<Company>("/bizbridge/company/update", {
					method: "PATCH",
					body: JSON.stringify(formData)
				})
				setCompany(updated)
			}
			setEditing(false)
		} catch (err) {
			console.error("Failed to update profile", err);
		}
	}

	if (loading) return <p>Loading...</p>

	if (role === "customer" && customer) {
		return (
			<div className="p-4">
				<h1 className="text-x1 font-bold">Customer Profile</h1>
				<img src={customer.photourl ?? ""} alt="Profile" className="w-24 h-24 rounded-full" />
				<p>Email: {customer.email}</p>
				<label>
					<input type="text" name="name"
						value={formData.name ?? ""}
						onChange={handleChange}
						disabled={!editing}
						className="border p-2 w-full"
					/>
				</label>
				<label>
					<input type="text" name="description"
						value={formData.description ?? ""}
						onChange={handleChange}
						disabled={!editing}
						className="border p-2 w-full"
					/>
				</label>
				<label>
					<input type="text" name="country"
						value={formData.country ?? ""}
						onChange={handleChange}
						disabled={!editing}
						className="border p-2 w-full"
					/>
				</label>
				{!editing ? (
					<button
						onClick={() => setEditing(true)}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
					>edit
					</button>
				) : (
					<div>
						<button onClick={handleSave}
							className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
						>
							save
						</button>
						<button onClick={() => setEditing(false)}
							className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
						>
							cancel
						</button>

					</div>
				)}
			</div>
		);
	}
	if (role === "company" && company) {
		return (
			<div className="p-4">
				<h1 className="text-x1 font-bold">Company Profile</h1>
				<img src={company.photourl ?? ""} alt="Profile" className="w-24 h-24 rounded-full" />
				<p>Email: {company.email}</p>
				<label>
					<input type="text" name="name"
						value={formData.name ?? ""}
						onChange={handleChange}
						disabled={!editing}
						className="border p-2 w-full"
					/>
				</label>
				<label>
					<input type="text" name="description"
						value={formData.description ?? ""}
						onChange={handleChange}
						disabled={!editing}
						className="border p-2 w-full"
					/>
				</label>
				<label>
					<input type="text" name="address"
						value={formData.address ?? ""}
						onChange={handleChange}
						disabled={!editing}
						className="border p-2 w-full"
					/>
				</label>
				<label>
					<input type="text" name="username"
						value={formData.username ?? ""}
						onChange={handleChange}
						disabled={!editing}
						className="border p-2 w-full"
					/>
				</label>
				{!editing ? (
					<button
						onClick={() => setEditing(true)}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
					>edit
					</button>
				) : (
					<div>
						<button onClick={handleSave}
							className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
						>
							save
						</button>
						<button onClick={() => setEditing(false)}
							className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
						>
							cancel
						</button>

					</div>
				)}
			</div>
		);
	}

	return <p>No profile data</p>;
}

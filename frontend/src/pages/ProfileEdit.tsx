import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import type { Customer, Company } from "../store/auth";
import { apiFetch } from "../api/client";
import { Navbar } from "../components/Navbar";
import DefaultPFP from "../assets/defaultpfp.jpg"
import { CompanyFileUploader } from "../components/CompanyFileUploader";

export default function ProfileEdit() {
	const { role, customer, company, setCompany, setCustomer } = useAuthStore();
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false)
	const [formData, setFormData] = useState<Partial<Customer & Company>>({})
	const profileSrc = role === "customer" ? customer?.photourl || DefaultPFP : company?.photourl || DefaultPFP
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

	return (
		<div className="flex flex-col h-screen w-full overflow-hidden">
			<Navbar />

			<div className="flex-1 overflow-auto p-6 bg-gray-50">
				<div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6 flex flex-col gap-4">
					<div className="flex items-center gap-4">
						<img
							src={profileSrc}
							className="w-24 h-24 rounded-full object-cover"
						/>
						<h1 className="text-2xl font-bold">
							{role === "customer" ? "Customer Profile" : "Company Profile"}
						</h1>
					</div>

					<p className="text-gray-600">Email: {role === "customer" ? customer?.email : company?.email}</p>

					{/* Form fields */}
					<div className="flex flex-col gap-3">
						{role === "customer" ? (
							<>
								<input
									name="name"
									value={formData.name ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Name"
									className="border rounded p-2 w-full"
								/>
								<input
									name="description"
									value={formData.description ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Description"
									className="border rounded p-2 w-full"
								/>
								<input
									name="country"
									value={formData.country ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Country"
									className="border rounded p-2 w-full"
								/>
							</>
						) : (
							<>
								<input
									name="name"
									value={formData.name ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Name"
									className="border rounded p-2 w-full"
								/>
								<input
									name="description"
									value={formData.description ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Description"
									className="border rounded p-2 w-full"
								/>
								<input
									name="address"
									value={formData.address ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Address"
									className="border rounded p-2 w-full"
								/>
								<input
									name="username"
									value={formData.username ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Username"
									className="border rounded p-2 w-full"
								/>
							</>
						)}
					</div>

					{/* Action buttons */}
					<div className="flex gap-3 mt-4">
						{!editing ? (
							<button
								onClick={() => setEditing(true)}
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
							>
								Edit
							</button>
						) : (
							<>
								<button
									onClick={handleSave}
									className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
								>
									Save
								</button>
								<button
									onClick={() => setEditing(false)}
									className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
								>
									Cancel
								</button>
							</>
						)}
					</div>

					{role === "company" && company && (
						<div className="mt-6 border-t pt-4">
							<CompanyFileUploader companyId={company.id} />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

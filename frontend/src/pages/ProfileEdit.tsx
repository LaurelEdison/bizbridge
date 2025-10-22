import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import type { Customer, Company } from "../store/auth";
import { apiFetch } from "../api/client";
import { Navbar } from "../components/Navbar";
import DefaultPFP from "../assets/defaultpfp.jpg";
import { CompanyFileUploader } from "../components/CompanyFileUploader";
import { ProfilePictureUploader } from "../components/ProfilePictureUploader";
import { BannerUploader } from "../components/BannerUploader";

export default function ProfileEdit() {
	const { role, customer, company, setCompany, setCustomer } = useAuthStore();
	const [loading, setLoading] = useState(true);
	const [editing, setEditing] = useState(false);
	const [formData, setFormData] = useState<Partial<Customer & Company>>({});
	const profileSrc =
		role === "customer"
			? customer?.photourl
				? `${customer.photourl}`
				: DefaultPFP
			: company?.photourl
				? `${company.photourl}`
				: DefaultPFP;

	useEffect(() => {
		async function loadProfile() {
			try {
				if (role === "customer" && !customer) {
					const customer = await apiFetch<Customer>("/bizbridge/customer/me");
					setCustomer(customer);
					setFormData(customer);
				} else if (role === "company" && !company) {
					const company = await apiFetch<Company>("/bizbridge/company/me");
					setCompany(company);
					setFormData(company);
				} else {
					if (role === "customer" && customer) setFormData(customer);
					else if (role === "company" && company) setFormData(company);
					else setFormData({});
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
		setFormData({ ...formData, [e.target.name]: e.target.value });
	}

	async function handleSave() {
		try {
			if (role === "customer") {
				const updated = await apiFetch<Customer>("/bizbridge/customer/update", {
					method: "PATCH",
					body: JSON.stringify(formData),
				});
				setCustomer(updated);
			} else if (role === "company") {
				const updated = await apiFetch<Company>("/bizbridge/company/update", {
					method: "PATCH",
					body: JSON.stringify(formData),
				});
				setCompany(updated);
			}
			setEditing(false);
		} catch (err) {
			console.error("Failed to update profile", err);
		}
	}

	if (loading) return <p className="text-gray-500 text-center mt-10">Loading profile...</p>;

	return (
		<div className="flex flex-col h-screen w-full overflow-hidden font-[Inria_Serif] bg-[#f9fafb] text-[#2d3748]">
			<Navbar />

			<div className="flex-1 overflow-auto p-6">
				<div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-8">
					{/* Header */}
					<div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
						<h1 className="text-3xl font-bold text-[#094233]">
							{role === "customer" ? "Customer Profile" : "Company Profile"}
						</h1>
					</div>

					{/* Profile Picture */}
					<div className="flex flex-col items-center gap-3 mb-6">
						<ProfilePictureUploader
							currentPhoto={profileSrc}
							role={role}
							onUploaded={(url) => {
								if (role === "customer") {
									setCustomer({ ...customer!, photourl: url });
								} else {
									setCompany({ ...company!, photourl: url });
								}
							}}
						/>
						<p className="text-gray-500 text-sm">Click the photo to update</p>
					</div>

					{/* Email */}
					<p className="text-gray-700 font-medium mb-4">
						<span className="text-gray-500 font-normal">Email:</span>{" "}
						{role === "customer" ? customer?.email : company?.email}
					</p>

					{/* Editable Form Fields */}
					<div className="flex flex-col gap-4">
						{role === "customer" ? (
							<>
								<input
									name="name"
									value={formData.name ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Name"
									className={`border rounded-lg p-2.5 w-full transition ${editing
										? "border-[#cce3d9] focus:ring-2 focus:ring-[#276749]"
										: "bg-gray-50 border-gray-200 text-gray-500"
										}`}
								/>
								<input
									name="description"
									value={formData.description ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Description"
									className={`border rounded-lg p-2.5 w-full transition ${editing
										? "border-[#cce3d9] focus:ring-2 focus:ring-[#276749]"
										: "bg-gray-50 border-gray-200 text-gray-500"
										}`}
								/>
								<input
									name="country"
									value={formData.country ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Country"
									className={`border rounded-lg p-2.5 w-full transition ${editing
										? "border-[#cce3d9] focus:ring-2 focus:ring-[#276749]"
										: "bg-gray-50 border-gray-200 text-gray-500"
										}`}
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
									className={`border rounded-lg p-2.5 w-full transition ${editing
										? "border-[#cce3d9] focus:ring-2 focus:ring-[#276749]"
										: "bg-gray-50 border-gray-200 text-gray-500"
										}`}
								/>
								<input
									name="description"
									value={formData.description ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Description"
									className={`border rounded-lg p-2.5 w-full transition ${editing
										? "border-[#cce3d9] focus:ring-2 focus:ring-[#276749]"
										: "bg-gray-50 border-gray-200 text-gray-500"
										}`}
								/>
								<input
									name="address"
									value={formData.address ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Address"
									className={`border rounded-lg p-2.5 w-full transition ${editing
										? "border-[#cce3d9] focus:ring-2 focus:ring-[#276749]"
										: "bg-gray-50 border-gray-200 text-gray-500"
										}`}
								/>
								<input
									name="username"
									value={formData.username ?? ""}
									onChange={handleChange}
									disabled={!editing}
									placeholder="Username"
									className={`border rounded-lg p-2.5 w-full transition ${editing
										? "border-[#cce3d9] focus:ring-2 focus:ring-[#276749]"
										: "bg-gray-50 border-gray-200 text-gray-500"
										}`}
								/>
							</>
						)}
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3 mt-6">
						{!editing ? (
							<button
								onClick={() => setEditing(true)}
								className="px-5 py-2.5 bg-[#094233] text-white rounded-lg hover:bg-[#276749] transition shadow-sm"
							>
								Edit
							</button>
						) : (
							<>
								<button
									onClick={handleSave}
									className="px-5 py-2.5 bg-[#2f855a] text-white rounded-lg hover:bg-[#276749] transition shadow-sm"
								>
									Save
								</button>
								<button
									onClick={() => setEditing(false)}
									className="px-5 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition shadow-sm"
								>
									Cancel
								</button>
							</>
						)}
					</div>

					{/* Company file section */}
					{role === "company" && company && (
						<div className="mt-8 border-t border-gray-100 pt-6 space-y-8">
							<div>
								<h2 className="text-lg font-semibold text-[#094233] mb-3">
									Company Files
								</h2>
								<CompanyFileUploader companyId={company.id} />
							</div>
							<div className="border-t border-gray-100 pt-6">
								<h2 className="text-lg font-semibold text-[#094233] mb-3">
									Company Banners
								</h2>
								<BannerUploader companyId={company.id} />
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

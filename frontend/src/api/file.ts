import type { fileResponse, CompanyFile, CustomerFile } from "../store/fileStore";
import { useAuthStore } from "../store/auth";
import { apiFetch } from "./client";

export async function uploadCompanyFiles(files: File[]): Promise<fileResponse[]> {
	const formData = new FormData();
	files.forEach(file => formData.append("files", file));

	const token = useAuthStore.getState().token;

	const res = await fetch("http://localhost:8080/bizbridge/company/upload", {
		method: "POST",
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		body: formData,
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Upload failed ${res.status}: ${text}`);
	}
	return await res.json();
}

export async function getCompanyFiles(company_id: string): Promise<CompanyFile[]> {
	const params = new URLSearchParams();
	params.append("company_id", company_id)
	return apiFetch<CompanyFile[]>(`/bizbridge/company/files?${params}`)
}
export async function getCustomerFiles(customer_id: string): Promise<CustomerFile[]> {
	const params = new URLSearchParams();
	params.append("customer_id", customer_id)
	return apiFetch<CustomerFile[]>(`/bizbridge/customer/files?${params}`)
}

import type { fileResponse, CompanyFile, CustomerFile } from "../store/fileStore";
import { apiFetch } from "./client";

export async function uploadCompanyFiles(files: File[]): Promise<fileResponse[]> {
	const formData = new FormData();
	files.forEach(file => formData.append("files", file));

	return apiFetch<fileResponse[]>("/company/upload", {
		method: "POST",
		body: formData,
	});
}

export async function getCompanyFiles(company_id: string): Promise<CompanyFile[]> {
	const params = new URLSearchParams();
	params.append("company_id", company_id)
	return apiFetch<CompanyFile[]>(`/company/files?${params}`)
}
export async function getCustomerFiles(customer_id: string): Promise<CustomerFile[]> {
	const params = new URLSearchParams();
	params.append("customer_id", customer_id)
	return apiFetch<CustomerFile[]>(`/customer/files?${params}`)
}

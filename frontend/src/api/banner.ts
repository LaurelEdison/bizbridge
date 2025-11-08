import type { CompanyBanner } from "../store/bannerStore";
import type { fileResponse } from "../store/fileStore";
import { apiFetch } from "./client";


export async function uploadCompanyBanners(files: File[]): Promise<fileResponse[]> {
	const formData = new FormData();
	files.forEach(file => formData.append("files", file));

	return apiFetch<fileResponse[]>("/company/upload-banner", {
		method: "POST",
		body: formData,
	});
}

export async function getCompanyBanners(company_id: string): Promise<CompanyBanner[]> {
	const params = new URLSearchParams();
	params.append("company_id", company_id)
	return apiFetch<CompanyBanner[]>(`/company/banners?${params}`)
}
export async function getCustomerBanners(customer_id: string): Promise<CompanyBanner[]> {
	const params = new URLSearchParams();
	params.append("customer_id", customer_id)
	return apiFetch<CompanyBanner[]>(`/customer/banners?${params}`)
}

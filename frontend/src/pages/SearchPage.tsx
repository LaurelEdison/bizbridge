import { useState, useEffect } from "react";
import { searchCompanies } from "../api/search";
import { useAuthStore, type Company } from "../store/auth";
import { createChatRoom } from "../api/chat";
import { Navbar } from "../components/Navbar";
import { CompanyFileGallery } from "../components/CompanyFileGallery";
import { CompanyBannerCarousel } from "../components/CompanyBannerCarousel";
import Footer from "../components/Footer";

export function SearchPage() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Company[]>([]);
	const [loading, setLoading] = useState(false);
	const { customer } = useAuthStore();

	async function handleSearch() {
		setLoading(true);
		try {
			const data = await searchCompanies(query);
			setResults(data);
		} catch (err) {
			console.error("Search failed", err);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		// Optional: auto-search on first load or debounce search
		handleSearch();
	}, []);

	return (
		<div className="flex flex-col min-h-screen w-full overflow-x-hidden">
			<Navbar />
			<main className="flex-1 min-h-screen p-6 max-w-5xl mx-auto w-full">
				<h1 className="text-2xl font-semibold mb-4">Find Companies</h1>

				<div className="flex flex-col md:flex-row gap-4 mb-6">
					<div className="flex-1">
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search by company name..."
							className="w-full border border-gray-300 p-2 rounded"
						/>
					</div>
					<button
						onClick={handleSearch}
						className="bg-[#198754] text-white px-4 py-2 rounded hover:bg-blue-600 transition"
					>
						Search
					</button>
				</div>

				{loading && <div className="text-gray-500">Searching...</div>}

				<div className="grid gap-4 md:grid-cols-2">
					{results.map((company) => (
						<div
							key={company.id}
							className="border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
						>
							<div className="mb-4">
								<CompanyBannerCarousel companyId={company.id} />
							</div>
							<h2 className="text-lg font-bold">{company.name}</h2>
							<p className="text-gray-600 text-sm">{company.address}</p>
							<p className="text-gray-500 text-sm">{company.email}</p>

							<CompanyFileGallery companyId={company.id} />

							{customer && (
								<button
									onClick={async () => {
										try {
											await createChatRoom(company.id);
											window.location.href = "/chat";
										} catch (err) {
											console.error("Failed to create chat room", err)
										}
									}
									}
									className="mt-2 text-sm bg-[#198754] text-white px-3 py-1 rounded"
								>
									Message
								</button>
							)}
						</div>
					))}
				</div>

				{!loading && results.length === 0 && (
					<div className="text-gray-500 text-center mt-8">No results found.</div>
				)}
			</main>
			<Footer />
		</div>
	);
}

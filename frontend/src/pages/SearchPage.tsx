import { useState, useEffect } from "react";
import { searchCompanies } from "../api/search";
import { SectorSelector } from "../components/SectorSelector";
import { useAuthStore, type Company } from "../store/auth";
import { createChatRoom } from "../api/chat";
import { Navbar } from "../components/Navbar";
import { CompanyFileGallery } from "../components/CompanyFileGallery";

export function SearchPage() {
	const [selectedSector, setSelectedSector] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Company[]>([]);
	const [loading, setLoading] = useState(false);
	const { customer } = useAuthStore();

	async function handleSearch() {
		setLoading(true);
		try {
			const data = await searchCompanies(selectedSector ?? undefined, query);
			setResults(data);
		} catch (err) {
			console.error("Search failed", err);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		handleSearch();
	}, []);

	return (
		<div className="flex flex-col min-h-screen w-full overflow-hidden font-[Inria_Serif] bg-[#f9fafb] text-[#2d3748]">
			<Navbar />

			<div className="p-8 max-w-6xl mx-auto w-full">
				<h1 className="text-3xl font-bold text-[#094233] mb-6">
					Find Companies
				</h1>

				<div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-white shadow-sm rounded-xl p-6 border border-gray-100">
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search by company name..."
						className="flex-1 border border-gray-300 focus:ring-2 focus:ring-[#094233] p-3 rounded-lg outline-none transition"
					/>

					<SectorSelector
						selected={selectedSector ? [selectedSector] : []}
						onChange={(arr) => setSelectedSector(arr[0] ?? null)}
					/>

					<button
						onClick={handleSearch}
						className="px-6 py-3 bg-[#094233] text-white rounded-lg font-medium hover:bg-[#0b553f] transition shadow-md"
					>
						{loading ? "Searching..." : "Search"}
					</button>
				</div>

				{!loading && results.length === 0 && (
					<div className="text-gray-500 text-center mt-12 text-lg">
						No results found.
					</div>
				)}

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{results.map((company) => (
						<div
							key={company.id}
							className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
						>
							<h2 className="text-xl font-semibold text-[#094233] mb-1">
								{company.name}
							</h2>
							<p className="text-gray-600 text-sm">{company.address}</p>
							<p className="text-gray-500 text-sm mb-3">{company.email}</p>

							<CompanyFileGallery companyId={company.id} />

							{customer && (
								<button
									onClick={async () => {
										try {
											await createChatRoom(company.id);
											window.location.href = "/chat";
										} catch (err) {
											console.error("Failed to create chat room", err);
										}
									}}
									className="mt-4 w-full text-sm bg-[#094233] text-white py-2.5 rounded-lg hover:bg-[#0b553f] transition shadow-sm"
								>
									Message
								</button>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

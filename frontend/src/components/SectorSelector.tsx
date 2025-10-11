import { useEffect } from "react";
import { useSectorStore } from "../store/sectorStore";

type SectorSelectorProps = {
	selected: string[];
	onChange: (newSelected: string[]) => void;
}
export function SectorSelector({ selected, onChange }: SectorSelectorProps) {
	const { sectors, loading, fetchSectors } = useSectorStore();

	useEffect(() => {
		fetchSectors();
	}, [fetchSectors]);

	if (loading) return <div>Loading sectors...</div>;

	const available = sectors.filter((s) => !selected.includes(s.id));
	const selectedSectors = sectors.filter((s) => selected.includes(s.id));

	const add = (id: string) => onChange([...selected, id]);
	const remove = (id: string) => onChange(selected.filter((sid) => sid !== id));

	return (
		<div className="flex flex-col gap-4">
			<div>
				<h3 className="text-sm font-medium text-gray-700 mb-2">Available Sectors</h3>
				<div className="flex flex-wrap gap-2">
					{available.length === 0 ? (
						<p className="text-gray-400 text-sm">All selected</p>
					) : (
						available.map((sector) => (
							<button
								type="button"
								key={sector.id}
								onClick={() => add(sector.id)}
								className="px-3 py-1.5 rounded-full bg-gray-100 border border-gray-300 hover:bg-gray-200 transition"
							>
								{sector.name}
							</button>
						))
					)}
				</div>
			</div>
			<div>
				<h3 className="text-sm font-medium text-gray-700 mb-2">Selected Sectors</h3>
				<div className="flex flex-wrap gap-2">
					{selectedSectors.length === 0 ? (
						<p className="text-gray-400 text-sm">No sectors selected</p>
					) : (
						selectedSectors.map((sector) => (
							<div
								key={sector.id}
								className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-300"
							>
								{sector.name}
								<button
									type="button"
									onClick={() => remove(sector.id)}
									className="text-blue-500 hover:text-blue-700"
								>
									✕
								</button>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

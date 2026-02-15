import { useEffect } from "react";
import { useSectorStore } from "../store/sectorStore";

type SectorSelectorProps = {
  selected: string[];
  onChange: (newSelected: string[]) => void;
};

export function SectorSelector({ selected, onChange }: SectorSelectorProps) {
  const { sectors, loading, fetchSectors } = useSectorStore();

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  if (loading)
    return <div className="text-gray-500 italic">Loading sectors...</div>;

  const available = sectors.filter((s) => !selected.includes(s.id));
  const selectedSectors = sectors.filter((s) => selected.includes(s.id));

  const add = (id: string) => onChange([...selected, id]);
  const remove = (id: string) => onChange(selected.filter((sid) => sid !== id));

  return (
    <div className="flex flex-col gap-5 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      {/* Available Sectors */}
      <div>
        <h3 className="text-sm font-semibold text-[#094233] mb-2 tracking-wide">
          Available Sectors
        </h3>
        <div className="flex flex-wrap gap-2">
          {available.length === 0 ? (
            <p className="text-gray-400 text-sm">All sectors selected</p>
          ) : (
            available.map((sector) => (
              <button
                type="button"
                key={sector.id}
                onClick={() => add(sector.id)}
                className="px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 bg-gray-50 hover:bg-[#e9f5ee] hover:text-[#094233] transition"
              >
                {sector.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Selected Sectors */}
      <div>
        <h3 className="text-sm font-semibold text-[#094233] mb-2 tracking-wide">
          Selected Sectors
        </h3>
        <div className="flex flex-wrap gap-2">
          {selectedSectors.length === 0 ? (
            <p className="text-gray-400 text-sm">No sectors selected</p>
          ) : (
            selectedSectors.map((sector) => (
              <div
                key={sector.id}
                className="flex items-center gap-2 bg-[#e9f5ee] text-[#094233] px-3 py-1.5 rounded-full border border-[#cce3d9] shadow-sm"
              >
                <span>{sector.name}</span>
                <button
                  type="button"
                  onClick={() => remove(sector.id)}
                  className="text-[#2f855a] hover:text-[#094233] transition font-semibold"
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

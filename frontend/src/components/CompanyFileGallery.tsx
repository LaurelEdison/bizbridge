import { useEffect, useState } from "react";
import type { CompanyFile } from "../store/fileStore";
import { getCompanyFiles } from "../api/file";
import { FileText } from "lucide-react";

export function CompanyFileGallery({ companyId }: { companyId: string }) {
  const [files, setFiles] = useState<CompanyFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getCompanyFiles(companyId);
        console.log("Company files:", JSON.stringify(data, null, 2));
        setFiles(data);
      } catch (err) {
        console.error("Failed to fetch files for company:", companyId, err);
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  if (loading)
    return <p className="text-xs text-gray-400 mt-2">Loading files...</p>;
  if (!files.length) return null;

  return (
    <div className="grid grid-cols-3 gap-3 mt-2">
      {files.slice(0, 3).map((file) => {
        const isPDF = file.file_name.toLowerCase().endsWith(".pdf");
        const fileUrl = file.url.startsWith("/uploads/")
          ? `${import.meta.env.VITE_API_URL || ""}${file.url}`
          : file.url;
        return (
          <div
            key={file.id}
            onClick={() => window.open(fileUrl, "_blank")}
            className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
              {isPDF ? (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <FileText size={36} className="mb-1 text-[#2d3748]" />
                  <span className="text-[11px] font-medium">PDF File</span>
                </div>
              ) : (
                <img
                  src={fileUrl}
                  alt={file.file_name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end justify-center pointer-events-none">
              <p className="text-white text-xs mb-2 opacity-0 group-hover:opacity-100 transition">
                {file.file_name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { useEffect, useState } from "react";
import type { CompanyFile } from "../store/fileStore";
import { getCompanyFiles } from "../api/file";

export function CompanyFileGallery({ companyId }: { companyId: string }) {
	const [files, setFiles] = useState<CompanyFile[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const data = await getCompanyFiles(companyId)
				setFiles(data);
			} catch (err) {
				console.error("Failed to fetch files for company:", companyId, err);
			} finally {
				setLoading(false);
			}
		})();
	}, [companyId]);

	if (loading) return <p className="text-xs text-gray-400 mt-2">Loading files...</p>;
	if (!files.length) return null;

	return (
		<div className="grid grid-cols-3 gap-2 mt-2">
			{files.slice(0, 3).map((file) => {
				const isPDF = file.file_name.toLowerCase().endsWith(".pdf");
				return (
					<div key={file.id} className="relative border rounded overflow-hidden">
						{isPDF ? (
							<iframe
								src={`http://localhost:8080/bizbridge${file.url}`}
								title={file.file_name}
								className="w-full h-24"
							/>
						) : (
							<img
								src={`http://localhost:8080/bizbridge${file.url}`}
								alt={file.file_name}
								className="w-full h-24 object-cover"
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

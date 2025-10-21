import { useState, useEffect } from "react";
import { uploadCompanyFiles, getCompanyFiles } from "../api/file";
import type { CompanyFile } from "../store/fileStore";

export function CompanyFileUploader({ companyId }: { companyId: string }) {
	const [files, setFiles] = useState<CompanyFile[]>([]);
	const [uploading, setUploading] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	async function fetchFiles() {
		try {
			const data = await getCompanyFiles(companyId);
			setFiles(data);
		} catch (err) {
			console.error("Failed to fetch company files:", err);
		}
	}

	async function handleUpload() {
		if (!selectedFiles.length) return;
		setUploading(true);
		try {
			const res = await uploadCompanyFiles(selectedFiles);
			console.log("Uploaded:", res);

			await fetchFiles(); // refresh list

			setSelectedFiles([]);
		} catch (err) {
			console.error("Upload failed:", err);
		} finally {
			setUploading(false);
		}
	}

	useEffect(() => {
		fetchFiles();
	}, [companyId]);

	return (
		<div className="mt-6 border-t pt-4">
			<h2 className="text-lg font-semibold mb-3">Company Files</h2>

			<div className="flex items-center gap-3 mb-4">
				<input
					type="file"
					accept=".pdf,.png,.jpg,.jpeg"
					multiple
					onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
					className="border p-2 rounded"
				/>
				<button
					onClick={handleUpload}
					disabled={!selectedFiles.length || uploading}
					className={`px-4 py-2 rounded text-white ${uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
						}`}
				>
					{uploading ? "Uploading..." : "Upload"}
				</button>
			</div>

			{files.length > 0 ? (
				<div className="grid grid-cols-3 gap-3">
					{files.map((file) => {
						const isPDF = file.file_name.toLowerCase().endsWith(".pdf");
						return (
							<div
								key={file.id}
								className="border rounded-md overflow-hidden shadow-sm relative"
							>
								{isPDF ? (
									<iframe
										src={`${file.url}`}
										title={file.file_name}
										className="w-full h-32"
									/>
								) : (
									<img
										src={`${file.url}`}
										alt={file.file_name}
										className="w-full h-32 object-cover"
									/>
								)}
								<div className="p-1 text-xs text-center truncate">
									{file.file_name}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<p className="text-gray-500 text-sm">No files uploaded yet</p>
			)}
		</div>
	);
}

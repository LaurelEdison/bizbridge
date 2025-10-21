import { useState, useEffect } from "react";
import { uploadCompanyFiles, getCompanyFiles } from "../api/file";
import type { CompanyFile } from "../store/fileStore";
import { FileText, Image as ImageIcon, Upload } from "lucide-react";

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
			await uploadCompanyFiles(selectedFiles);
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
		<div className="mt-6 border-t pt-6">
			<div className="flex items-center gap-3 mb-5">
				<label className="flex items-center gap-2 border border-gray-300 bg-white px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
					<Upload className="w-4 h-4 text-gray-500" />
					<span className="text-sm text-gray-600">Choose files</span>
					<input
						type="file"
						accept=".pdf,.png,.jpg,.jpeg"
						multiple
						onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
						className="hidden"
					/>
				</label>

				<button
					onClick={handleUpload}
					disabled={!selectedFiles.length || uploading}
					className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition ${uploading || !selectedFiles.length
						? "bg-gray-400 cursor-not-allowed"
						: "bg-blue-500 hover:bg-blue-600"
						}`}
				>
					{uploading ? "Uploading..." : "Upload"}
				</button>
			</div>

			{files.length > 0 ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
					{files.map((file) => {
						const isPDF = file.file_name.toLowerCase().endsWith(".pdf");
						return (
							<div
								key={file.id}
								className="border border-gray-200 rounded-xl bg-gray-50 hover:shadow-md transition overflow-hidden"
							>
								<div className="relative w-full h-36 flex items-center justify-center bg-white">
									{isPDF ? (
										<div className="flex flex-col items-center justify-center text-gray-500">
											<FileText className="w-10 h-10 mb-1" />
											<span className="text-xs text-gray-400">PDF File</span>
										</div>
									) : (
										<img
											src={file.url}
											alt={file.file_name}
											className="w-full h-full object-cover"
										/>
									)}
								</div>
								<div className="p-2 text-xs text-center text-gray-600 truncate">
									{file.file_name}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<p className="text-gray-500 text-sm mt-2">
					No files uploaded yet.
				</p>
			)}
		</div>
	);
}

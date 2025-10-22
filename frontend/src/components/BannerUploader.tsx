import React, { useEffect, useRef, useState } from "react";
import { useBannerStore } from "../store/bannerStore";
import { Loader2, Upload, X } from "lucide-react";

export const BannerUploader: React.FC<{ companyId: string }> = ({ companyId }) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { uploadBanners, fetchBanners, banners, deleteBanner, loading } = useBannerStore();
	const [localFiles, setLocalFiles] = useState<File[]>([]);

	// Fetch banners on mount
	useEffect(() => {
		if (companyId) fetchBanners(companyId, "company");
	}, [companyId, fetchBanners]);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const selected = Array.from(e.target.files);
		setLocalFiles((prev) => [...prev, ...selected]);
	};

	const handleUpload = async () => {
		if (localFiles.length === 0) return;
		try {
			await uploadBanners("company", localFiles);
			setLocalFiles([]);
			await fetchBanners(companyId, "company"); // refresh after upload
		} catch (err) {
			console.error("Upload failed", err);
		}
	};

	const removeLocalFile = (index: number) => {
		setLocalFiles((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div className="space-y-5 p-4 border rounded-2xl bg-white shadow-sm">
			<h2 className="text-lg font-semibold text-[#094233]">
				Upload & Manage Company Banners
			</h2>

			{/* Upload area */}
			<div
				onClick={() => fileInputRef.current?.click()}
				className="border-2 border-dashed border-[#cce3d9] rounded-xl p-6 text-center cursor-pointer hover:bg-[#f9fafb] transition"
			>
				<Upload className="inline-block w-6 h-6 mb-2 text-[#276749]" />
				<p className="text-gray-600">Click or drop banners here</p>
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept="image/*"
					className="hidden"
					onChange={handleFileSelect}
				/>
			</div>

			{/* Local files preview */}
			{localFiles.length > 0 && (
				<div>
					<h3 className="text-sm font-medium mb-2 text-gray-700">Pending Upload</h3>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{localFiles.map((file, i) => (
							<div key={i} className="relative border rounded-lg overflow-hidden">
								<img
									src={URL.createObjectURL(file)}
									alt={file.name}
									className="w-full h-32 object-cover"
								/>
								<button
									onClick={() => removeLocalFile(i)}
									className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
								>
									<X size={14} />
								</button>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Upload button */}
			<button
				onClick={handleUpload}
				disabled={loading || localFiles.length === 0}
				className={`w-full py-2 rounded-xl font-semibold text-white ${loading || localFiles.length === 0
					? "bg-gray-400 cursor-not-allowed"
					: "bg-[#276749] hover:bg-[#2f855a]"
					}`}
			>
				{loading ? (
					<span className="flex justify-center items-center gap-2">
						<Loader2 className="animate-spin" size={18} /> Uploading...
					</span>
				) : (
					"Upload Banners"
				)}
			</button>

			{/* Uploaded banners viewer */}
			<div className="mt-6">
				<h3 className="text-sm font-medium mb-2 text-gray-700">Uploaded Banners</h3>
				{loading && banners.length === 0 ? (
					<p className="text-gray-400 text-sm">Loading banners...</p>
				) : banners.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{banners.map((b) => (
							<div
								key={b.id}
								className="relative border rounded-lg overflow-hidden group"
							>
								<img
									src={b.url}
									alt={b.file_name}
									className="w-full h-32 object-cover group-hover:opacity-90 transition"
								/>
								<button
									onClick={() => deleteBanner(b.id)}
									className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
								>
									<X size={14} />
								</button>
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-400 text-sm italic">No banners uploaded yet.</p>
				)}
			</div>
		</div>
	);
};

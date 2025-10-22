import { useEffect } from "react";
import { useBannerStore } from "../store/bannerStore";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useState } from "react";

export const CompanyBannerCarousel: React.FC<{ companyId: string }> = ({ companyId }) => {
	const { banners, fetchBanners } = useBannerStore();
	const [index, setIndex] = useState(0);

	useEffect(() => {
		fetchBanners(companyId, "company");
	}, [companyId, fetchBanners]);

	if (banners.length === 0) {
		return (
			<div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
				<ImageOff size={32} />
			</div>
		);
	}

	const current = banners[index];

	const next = () => setIndex((prev) => (prev + 1) % banners.length);
	const prev = () => setIndex((prev) => (prev - 1 + banners.length) % banners.length);

	return (
		<div className="relative w-full h-40 overflow-hidden rounded-xl">
			<img
				src={current.url}
				alt={current.file_name}
				className="w-full h-full object-cover transition-all duration-500"
			/>

			{/* Overlay controls */}
			{banners.length > 1 && (
				<>
					<button
						onClick={prev}
						className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition"
					>
						<ChevronLeft size={18} />
					</button>
					<button
						onClick={next}
						className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition"
					>
						<ChevronRight size={18} />
					</button>

					{/* Indicators */}
					<div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
						{banners.map((_, i) => (
							<div
								key={i}
								className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};

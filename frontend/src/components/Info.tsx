import Slider from "react-slick";
import carouselSettings from "../hook/CarouselSetting";
import "@fontsource/inria-serif"
import carousel1 from "../assets/carousel1.png"
import carousel2 from "../assets/carousel2.png"
import carousel3 from "../assets/carousel3.png"
import homeCrafterKiri from "../assets/homeCrafterKiri.png"
import homePabrikKiri from "../assets/homePabrikKiri.png"
import homeBatikKanan from "../assets/homeBatikKanan.png"

export function Info() {
	return (
		<div className="font-[Inria_Serif] text-[#2d3748] w-full min-h-screen overflow-x-hidden overflow-y-auto overscroll-none">
			<section className="w-full mx-auto">
				<Slider {...carouselSettings}>
					<div>
						<img src={carousel1} alt="Slide 1" className="w-full object-cover" />
					</div>
					<div>
						<img src={carousel2} alt="Slide 2" className="w-full object-cover" />
					</div>
					<div>
						<img src={carousel3} alt="Slide 3" className="w-full object-cover" />
					</div>
				</Slider>
			</section>

			<section className="flex flex-row items-center justify-center gap-[10%] py-16 px-10">
				<img src={homeCrafterKiri} alt="Farmer" className="w-full max-w-[30%]" />
				<div>
					<p className="text-[40px] font-semibold mb-3">What is BizBridge?</p>
					<p className="text-[26px] leading-relaxed">
						A platform that connects Indonesian entrepreneurs with overseas customers.
						It facilitates partnerships and streamlines cross-border transactions with
						safe, fast, and reliable services.
						<br />
						<br />
						Find authentic, high-quality products directly from Indonesian producers.
					</p>
				</div>
			</section>

			<section className="flex flex-row items-center justify-center gap-[10%] py-16 px-10 bg-[#094233] text-white">
				<div>
					<p className="text-[40px] font-semibold mb-3">How does BizBridge work?</p>
					<p className="text-[26px] leading-relaxed">
						Overseas customers can search for Indonesian companies that offer the
						products or services they need.
						<br />
						<br />
						After finding a suitable company, customers can directly connect with the
						entrepreneurs through this fast feature on the platform.
						<br />
						<br />
						BizBridge does not handle transactions, but ensures all company profiles
						are trustworthy via background approval.
						<br />
						<br />
						Request and delivery can be made using methods agreed upon by both parties.
					</p>
				</div>
				<img src={homeBatikKanan} alt="batik" className="w-full max-w-[30%]" />
			</section>

			<section className="flex flex-row items-center justify-center gap-[10%] py-16 px-10">
				<img src={homePabrikKiri} alt="Warehouse" className="w-full max-w-[30%]" />
				<div>
					<p className="text-[40px] font-semibold mb-3">Is the company trustworthy?</p>
					<p className="text-[26px] leading-relaxed">
						To ensure this, BizBridge only displays credible Indonesian SMEs that pass
						the BizBridge review. Photos and activities are verified before displaying
						companies to customers.
						<br />
						<br />
						Are you interested in companies in BizBridge?
					</p>
				</div>
			</section>
		</div>
	);
}

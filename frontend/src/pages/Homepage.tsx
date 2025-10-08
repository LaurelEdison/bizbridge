import { Navbar } from "../components/Navbar";
import { Info } from "../components/Info";

export function HomePage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<Info />
		</div>
	);
}

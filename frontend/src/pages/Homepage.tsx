import { Navbar } from "../components/Navbar";
import { Info } from "../components/Info";
import Footer from "../components/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white font-[Inria_Serif]">
      <Navbar />
      <Info />
      <Footer />
    </div>
  );
}

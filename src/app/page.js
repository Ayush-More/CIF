import LogoSlider from "./components/CompanyLogoSlider";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import ImageSlider from "./components/ImageSlider";
import Navbar from "./components/Navbar";
import NearCenter from "./components/NearCenter";
import SeekingCare from "./components/SeekingCare";

export default function Home() {
  return (
    <>
      <div className="max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20">
        <Navbar />
      </div>
      <HeroSection />
      <LogoSlider />
      <div className="max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20">
        <SeekingCare />
        <NearCenter />
      </div>
      <Footer />
    </>
  );
}

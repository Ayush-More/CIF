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
      <Navbar />
      <HeroSection />
      <div className="max-w-7xl px-5 mx-auto md:px-10 lg:px-14 xl:px-20">
        <ImageSlider />
      </div>
      {/* <LogoSlider /> */}
      <div className="max-w-7xl px-5 mx-auto md:px-10 lg:px-14 xl:px-20">
        <SeekingCare />
        <NearCenter />
      </div>
      <Footer />
    </>
  );
}

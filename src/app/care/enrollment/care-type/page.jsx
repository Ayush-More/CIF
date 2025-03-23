"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";

export default function CareType() {
  const [selectedBanner, setSelectedBanner] = useState(null);
  const router = useRouter();

  const banners = [
    {
      id: "childcare",
      label: "Child care",
      image: "/Images/childcare.svg",
      link: "/care/enrollment/childcare/availability",
    },
    {
      id: "mentalphysical",
      label: "Mental and Physical health",
      image: "/Images/mentalphysical.svg",
      link: "/care/enrollment/mentalphysical/availability",
    },
    {
      id: "mealservice",
      label: "Meal Service",
      image: "/Images/mealservice.svg",
      link: "/care/enrollment/mealservice/availability",
    },
    {
      id: "tutoring",
      label: "Tutoring",
      image: "/Images/tutoring.svg",
      link: "/care/enrollment/tutoring/availability",
    },
  ];

  const handleNextClick = () => {
    const selectedBannerData = banners.find(
      (banner) => banner.id === selectedBanner
    );
    if (selectedBannerData) {
      router.push(selectedBannerData.link);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20 pt-24 pb-10">
        <div>
          <h1 className="font-[600] text-[28px] text-center">
            Choose The Type of Service, You are looking for
          </h1>
          <div className="flex justify-center">
            <div className="flex gap-5 items-center mt-8">
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/correct.svg" alt="" className="h-7" />
                <div className="text-[11px]">Service Type</div>
              </div>
              <div className="bg-[#EF5744] h-[2px] w-10 mb-7"></div>
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/active.svg" alt="" className="h-7" />
                <div className="text-[11px]">Services</div>
              </div>
              <div className="bg-[#EF5744] h-[2px] w-10 mb-7"></div>
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/unactive.svg" alt="" className="h-7" />
                <div className="text-[11px]">Availability</div>
              </div>
              <div className="bg-[#EAECF0] h-[2px] w-10 mb-7"></div>
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/unactive.svg" alt="" className="h-7" />
                <div className="text-[11px]">Personal Details</div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedBanner(banner.id)}
              >
                <img
                  src={banner.image}
                  alt={banner.label}
                  className={`w-48 hover:border-2 hover:border-[#EF5744] hover:rounded-xl ${
                    selectedBanner === banner.id
                      ? "border-2 border-[#EF5744] rounded-xl"
                      : ""
                  }`}
                />
                <div className="text-center font-[500] text-[17px] mt-3 hover:underline">
                  {banner.label}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8 gap-4">
            <button
              className="w-20 rounded-full px-[22px] py-[9px] text-[13px] bg-[#e3e3e3] text-[#000] cursor-pointer"
              onClick={() => router.back()}
            >
              Back
            </button>
            <button
              className={`w-20 rounded-full px-[22px] py-[9px] text-[13px] ${
                selectedBanner
                  ? "bg-[#EF5744] text-[#ffffff] cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleNextClick}
              disabled={!selectedBanner}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

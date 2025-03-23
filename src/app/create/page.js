"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Create() {
  const [selectedBanner, setSelectedBanner] = useState(null);
  const router = useRouter();

  const handleBannerClick = (banner) => {
    setSelectedBanner(banner);
  };

  const handleNextClick = () => {
    if (selectedBanner === "caregiver") {
      router.push("/search");
    } else if (selectedBanner === "carejob") {
      router.push("/care/enrollment/care-type");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20 pt-24">
        <div>
          <h1 className="font-[600] text-[28px] text-center">
            Choose The Type of Service, You are looking for
          </h1>
          <div className="flex justify-center gap-8 mt-8">
            <div
              className="cursor-pointer"
              onClick={() => handleBannerClick("caregiver")}
            >
              <img
                src="/Images/caregiver.svg"
                alt=""
                className={`w-56 hover:border-2 hover:border-[#EF5744] hover:rounded-xl ${
                  selectedBanner === "caregiver" ? "border-2 border-[#EF5744] rounded-xl" : ""
                }`}
              />
              <div className="text-center font-[500] text-[17px] mt-3">
                I need a Care Giver
              </div>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => handleBannerClick("carejob")}
            >
              <img
                src="/Images/carejob.svg"
                alt=""
                className={`w-56 hover:border-2 hover:border-[#EF5744] hover:rounded-xl ${
                  selectedBanner === "carejob" ? "border-2 border-[#EF5744] rounded-xl" : ""
                }`}
              />
              <div className="text-center font-[500] text-[17px] mt-3">
                I want a care job
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-7">
            <button
              className={`w-20 rounded-full px-[22px] py-[9px] text-[13px] ${
                selectedBanner
                  ? "bg-[#EF5744] text-[#fff] cursor-pointer"
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
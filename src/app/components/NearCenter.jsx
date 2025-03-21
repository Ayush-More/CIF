"use client";
import { useRef } from "react";
import NearCenterCard from "./NearCenterCard";
import data from "./../../../public/assets/data.js";
const { sliderData } = data;
export default function NearCenterSlider() {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div className="mt-[90px] flex justify-between">
        <div>
          <h1 className="text-[47px] font-[500]">Centre’s Near You</h1>
          <div className="text-[#475467] text-[14px]">
            We are dedicated to providing evidence-based information about
            addiction and treatment centers across America
          </div>
        </div>
        <div className="flex items-center gap-[19px]">
          <div className="flex gap-[10px]">
            <div
              onClick={scrollLeft}
              className="cursor-pointer border border-[#EAECF0] rounded-full w-[42px] h-[42px] flex justify-center items-center"
            >
              <img src="/Icons/leftarrow.svg" alt="" className="h-[14px]" />
            </div>
            <div
              onClick={scrollRight}
              className="cursor-pointer border border-[#EAECF0] rounded-full w-[42px] h-[42px] flex justify-center items-center"
            >
              <img src="/Icons/rightarrow.svg" alt="" className="h-[14px]" />
            </div>
          </div>
          <button className="cursor-pointer bg-[#EF5744] px-[22px] py-[12px] rounded-full text-[#fff] text-[15px]">
            View All
          </button>
        </div>
      </div>
      <div className="w-full mt-[39px]">
        <div
          ref={sliderRef}
          className="flex gap-[17px] overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        >
          {sliderData.map((data, index) => (
            <div key={index} className="flex-shrink-0 snap-center">
              <NearCenterCard data={data} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

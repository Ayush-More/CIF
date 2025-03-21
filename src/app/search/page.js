"use client";
import { useState } from "react";
import CareCard from "../components/CareCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import data from "./../../../public/assets/data.js";
import Modal from "../components/Modal";
const { carecardData } = data;

export default function Search() {
  const [selectedData, setSelectedData] = useState(null);

  const handleCardClick = (data) => {
    setSelectedData(data);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setSelectedData(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20">
        <Navbar />
        <div>
          <div>
            <div className="flex justify-between mt-[38px]">
              <h1 className="text-[26px] font-[500]">Care’s Near You</h1>
              <div className="flex gap-[13px]">
                <select
                  name="Category"
                  id=""
                  className="custom-select outline-none border border-[#0000001A] rounded-3xl px-[13px] py-[9px] text-[13px] font-[500]"
                >
                  <option value="" disabled selected>
                    Category
                  </option>
                </select>
                <select
                  name="Filter Option"
                  id=""
                  className="custom-select outline-none border border-[#0000001A] rounded-3xl px-[13px] py-[9px] text-[13px] font-[500]"
                >
                  <option value="" disabled selected>
                    Filter Option
                  </option>
                </select>
                <select
                  name="Ratings"
                  id=""
                  className="custom-select outline-none border border-[#0000001A] rounded-3xl px-[13px] py-[9px] text-[13px] font-[500]"
                >
                  <option value="" disabled selected>
                    Ratings
                  </option>
                </select>
              </div>
            </div>
            <div className="text-[12px] mt-[6px] text-[#475467]">
              We are dedicated to providing evidence-based information about
              care centers across America
            </div>
          </div>

          <div className="mt-[26px] flex flex-col gap-[19px]">
            {carecardData.map((data, index) => {
              return (
                <CareCard
                  key={index}
                  data={data}
                  handleCardClick={handleCardClick}
                  onClick={() => {
                    console.log(data);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
      <Modal data={selectedData} onClose={handleCloseModal} />
    </>
  );
}

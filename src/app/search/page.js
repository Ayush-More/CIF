"use client";
import { useState, useEffect } from "react";
import CareCard from "../components/CareCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { listCare } from "../services/auth";

export default function Search() {
  const [selectedData, setSelectedData] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredData, setFilteredData] = useState([]); // State for filtered data

  const handleList = async () => {
    const result = await listCare();
    setCardData(result.data.cares); // Assuming the API returns `data` key
    setFilteredData(result.data.cares); // Initialize filteredData
  };

  console.log(cardData, 11111);

  useEffect(() => {
    handleList();
  }, []);

  const handleCardClick = (data) => {
    setSelectedData(data);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setSelectedData(null);
    document.body.style.overflow = "auto";
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    console.log(cardData,"search")
    const filtered = cardData.filter((item) => 
      item.username && item.username.toLowerCase().includes(value) // Validate `item.name`
    );
    
    setFilteredData(filtered);
  };
  

  return (
    <>
      <Navbar />
      <div className="max-w-7xl px-5 mx-auto md:px-10 lg:px-14 xl:px-20 pt-16 md:pb-16">
        <div>
          <div>
            <div className="flex flex-col md:flex-row justify-between mt-[38px]">
              <h1 className="text-[26px] font-[500]">Care’s Near You</h1>
              <div className="text-[12px] mt-[4px] text-[#475467] md:hidden mb-5">
                We are dedicated to providing evidence-based information about
                care centers across America
              </div>
              <div className="flex gap-[13px]">
                <input
                  type="text"
                  placeholder="Search care centers"
                  className="outline-none border border-[#0000001A] rounded-3xl px-[13px] py-[9px] text-[13px] font-[500]"
                  value={searchTerm}
                  onChange={handleSearch} // Search handler
                />
                <select
                  name="Category"
                  id=""
                  className="custom-select outline-none border border-[#0000001A] rounded-3xl px-[13px] py-[9px] text-[13px] font-[500]"
                >
                  <option defaultValue="" disabled>
                    Meal Services
                  </option>
                  <option defaultValue="" disabled>
                    Tutoring
                  </option>
                  <option defaultValue="" disabled>
                    Physical Mental Health
                  </option>
                  <option defaultValue="" disabled>
                    Child Caring
                  </option>
                </select>
                <select
                  name="Filter Option"
                  id=""
                  className="custom-select outline-none border border-[#0000001A] rounded-3xl px-[13px] py-[9px] text-[13px] font-[500]"
                >
                  <option value="" disabled>
                    Filter Option
                  </option>
                </select>
                <select
                  name="Ratings"
                  id=""
                  className="custom-select outline-none border border-[#0000001A] rounded-3xl px-[13px] py-[9px] text-[13px] font-[500]"
                >
                  <option value="" disabled>
                    Ratings
                  </option>
                </select>
              </div>
            </div>
            <div className="text-[12px] mt-[6px] text-[#475467] hidden md:block">
              We are dedicated to providing evidence-based information about
              care centers across America
            </div>
          </div>

          <div className="mt-[26px] flex flex-col gap-[19px]">
            {filteredData.map((data, index) => {
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

"use client";
import { useState, useEffect } from "react";
import CareCard from "../components/CareCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import FilterSidebar from "../components/FilterSidebar";
import { listCare } from "../services/auth";

export default function Search() {
  const [selectedData, setSelectedData] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [filters, setFilters] = useState({});

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    // Apply filters to your search results here
  };

  const handleClearFilters = () => {
    setFilters({});
    // Reset search results here
  };

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
      <div className="max-w-full  mx-5 md:px-10 lg:px-10 xl:px-5 pt-14 md:pb-12">
      <div className="flex flex-col pt-10 md:flex-row gap-6">
      <div className="md:block">
          <FilterSidebar
            onFilter={handleFilter}
            onClearFilters={handleClearFilters}
          />
        </div>
        <div className="w-full">
        <div className="flex gap-[5px] w-full">
                <input
                  type="text"
                  placeholder="Search care centers"
                  className="outline-none border border-[#0000001A] rounded-2xl px-[13px] py-[9px] text-[13px] w-full font-[500]"
                  value={searchTerm}
                  onChange={handleSearch} // Search handler
                />
               
              </div>
          <div>
            <div className="flex flex-col md:flex-row justify-between mt-[38px]">
              <h1 className="text-[26px] font-[500]">Care’s Near You</h1>
              <div className="text-[12px] mt-[4px] text-[#475467] md:hidden mb-5">
                We are dedicated to providing evidence-based information about
                care centers across America
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
      </div>
      <Footer />
      <Modal data={selectedData} onClose={handleCloseModal} />
    </>
  );
}

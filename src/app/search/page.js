// "use client";
// import { useState, useEffect } from "react";
// import CareCard from "../components/CareCard";
// import Footer from "../components/Footer";
// import Navbar from "../components/Navbar";
// import Modal from "../components/Modal";
// import FilterSidebar from "../components/FilterSidebar";
// import { listCare } from "../services/auth";
// import { Filter } from 'lucide-react'; 

// export default function Search() {
//   const [selectedData, setSelectedData] = useState(null);
//   const [cardData, setCardData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // State for search term
//   const [filteredData, setFilteredData] = useState([]); // State for filtered data
//   const [filters, setFilters] = useState({});
//   const [allResults, setAllResults] = useState([]); 
//   const [filteredResults, setFilteredResults] = useState([]);

//   const handleFilter = (newFilters) => {
//     setFilters(newFilters);
//     // Apply filters to your search results here
//   };

//   const handleClearFilters = () => {
//     setFilters({});
//     // Reset search results here
//   };

//   const handleList = async () => {
//     const result = await listCare();
//     setCardData(result.data.cares); // Assuming the API returns `data` key
//     setFilteredData(result.data.cares); // Initialize filteredData
//     setAllResults(result.data.cares);

//   };

//   console.log(cardData, 11111);

//   useEffect(() => {
//     handleList();
//   }, []);

//   const handleCardClick = (data) => {
//     setSelectedData(data);
//     document.body.style.overflow = "hidden";
//   };

//   const handleCloseModal = () => {
//     setSelectedData(null);
//     document.body.style.overflow = "auto";
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchTerm(value);
//     console.log(cardData,"search")
//     const filtered = cardData.filter((item) => 
//       item.username && item.username.toLowerCase().includes(value) // Validate `item.name`
//     );
    
//     setFilteredData(filtered);
//   };
  

//   return (
//     <>
//       <Navbar />
//       <div className="max-w-full  mx-5 md:px-10 lg:px-10 xl:px-5 pt-14 md:pb-12">
//       <div className="flex flex-col pt-10 md:flex-row gap-6">
//       <div className="md:block">
//           <FilterSidebar
//             onFilter={handleFilter}
//             onClearFilters={handleClearFilters}
//           />
//         </div>
//         <div className="w-full">
//         <div className="flex gap-[5px] w-full">
//                 <input
//                   type="text"
//                   placeholder="Search care centers"
//                   className="outline-none border border-[#0000001A] rounded-2xl px-[13px] py-[9px] text-[13px] w-full font-[500]"
//                   value={searchTerm}
//                   onChange={handleSearch} // Search handler
//                 />
               
//               </div>
//           <div>
//             <div className="flex flex-col md:flex-row justify-between mt-[38px]">
//               <h1 className="text-[26px] font-[500]">Care’s Near You</h1>
//               <div className="text-[12px] mt-[4px] text-[#475467] md:hidden mb-5">
//                 We are dedicated to providing evidence-based information about
//                 care centers across America
//               </div>
           
//             </div>
//             <div className="text-[12px] mt-[6px] text-[#475467] hidden md:block">
//               We are dedicated to providing evidence-based information about
//               care centers across America
//             </div>
//           </div>

//           <div className="mt-[26px] flex flex-col gap-[19px]">
//             {filteredData.map((data, index) => {
//               return (
//                 <CareCard
//                   key={index}
//                   data={data}
//                   handleCardClick={handleCardClick}
//                   onClick={() => {
//                     console.log(data);
//                   }}
//                 />
//               );
//             })}
//           </div>
//         </div>
//         </div>
//       </div>
//       <Footer />
//       <Modal data={selectedData} onClose={handleCloseModal} />
//     </>
//   );
// }

'use client';
import { useState, useEffect } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';
import SearchCard from '../components/SearchCard';
import Navbar from '../components/Navbar';
import { Filter } from 'lucide-react';
import CareCard from "../components/CareCard";
import { listCare } from '../services/auth';
import { useSearchParams } from 'next/navigation';

// Define categoryMap at the top level, outside the component
const CATEGORY_MAP = {
  'Meal Service': 'mealservice',
  'Tutoring': 'tutoring',
  'Child care': 'childcare',
  'Mental and Physical health': 'mentalphysical'
};

export default function SearchPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const searchParams = useSearchParams();

 // Fetch initial data
 useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    setIsLoading(true);
    const response = await fetch(`/api/cares/list`);
    const result = await response.json();
    
    if (result.success) {
      setAllResults(result.data.cares);
      // Don't set filteredResults here, let the filtering effect handle it
      setPagination(result.data.pagination);
    } else {
      console.error('Failed to fetch data:', result.message);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setIsLoading(false);
  }
};

  // Handle URL parameters and filtering
  useEffect(() => {
    if (allResults.length === 0) return;

    const location = searchParams.get('location');
    const type = searchParams.get('type');
    
    // Create initial filters based on URL parameters
    const urlFilters = {};
    if (location) {
      urlFilters.selectedLocation = location;
    }
    if (type) {
      urlFilters.service = CATEGORY_MAP[type] || type.toLowerCase().replace(/\s+/g, '');
    }

    // Set filters from URL parameters
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }

    // Apply filtering
    let filtered = [...allResults];
    
    if (location) {
      filtered = filtered.filter(item => 
        item.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (type) {
      filtered = filtered.filter(item => {
        const itemCategory = item.category?.toLowerCase();
        const searchType = type.toLowerCase();
        
        // Check for direct match first
        if (itemCategory === searchType) return true;
        
        // Check for mapped values
        const mappedType = CATEGORY_MAP[type]?.toLowerCase();
        if (mappedType && itemCategory === mappedType) return true;
        
        // Check for partial matches
        return itemCategory?.includes(searchType.replace(/\s+/g, ''));
      });
    }
    
    setFilteredResults(filtered);
  }, [searchParams, allResults]);

  // Combined search and filter function
  const applySearchAndFilters = (currentSearchTerm = searchTerm, currentFilters = filters) => {
    let results = [...allResults];

    // Apply URL parameters first
    const location = searchParams.get('location');
    const type = searchParams.get('type');

    if (location) {
      results = results.filter(item => 
        item.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (type) {
      const searchType = type.toLowerCase();
      const mappedType = CATEGORY_MAP[type]?.toLowerCase();
      
      results = results.filter(item => {
        const itemCategory = item.category?.toLowerCase();
        return itemCategory === searchType || 
               (mappedType && itemCategory === mappedType) ||
               itemCategory?.includes(searchType.replace(/\s+/g, ''));
      });
    }

    // Apply search term
    if (currentSearchTerm.trim()) {
      const searchLower = currentSearchTerm.toLowerCase();
      results = results.filter(item => {
        return (
          item.location?.toLowerCase().includes(searchLower) ||
          item.username?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower) ||
          item.about?.toLowerCase().includes(searchLower) ||
          item.serviceType?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply filters
    if (Object.keys(currentFilters).length > 0) {
      results = results.filter(item => {
        // Service Type Filter
        if (currentFilters.service && item.category?.toLowerCase() !== currentFilters.service.toLowerCase()) {
          return false;
        }

        // Location Filter
        if (currentFilters.selectedLocation && 
            !item.location?.toLowerCase().includes(currentFilters.selectedLocation.toLowerCase())) {
          return false;
        }

        // Available Days Filter
        if (currentFilters.availableOn?.length > 0) {
          const hasMatchingDays = currentFilters.availableOn.some(day => 
            item.workingDays?.includes(day.substring(0, 3))
          );
          if (!hasMatchingDays) return false;
        }

        // Rate Filter
        if (currentFilters.service === 'mealservice') {
          const mealPrice = parseInt(item.mealPrice?.replace(/[^0-9]/g, '') || '0');
          if (mealPrice < currentFilters.hourlyRate) return false;
        } else {
          if (item.hourlyRate < currentFilters.hourlyRate) return false;
        }

        // Service-specific filters
        switch (currentFilters.service) {
          case 'childcare':
            if (currentFilters.overNightCare && !item.overnightCare) return false;
            if (currentFilters.schoolDropOff && !item.schoolDrop) return false;
            break;
          
          case 'mentalphysical':
            if (currentFilters.trainingMode && item.mode !== currentFilters.trainingMode) return false;
            break;
          
          case 'mealservice':
            if (currentFilters.monthlySubscription && !item.offerSubscription) return false;
            break;
        }

        return true;
      });
    }

    setFilteredResults(results);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    applySearchAndFilters(term, filters);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    applySearchAndFilters(searchTerm, newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setFilteredResults(allResults);
  };

  return (
    <div className="min-h-screen bg-gray-50">
       <Navbar />
      {/* Search Section */}
      <div className="bg-[#FCF1E8] py-4 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-[13px] text-[#101828]"
          >
            <Filter className="w-4 h-4" />
            Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar
            onFilter={handleFilter}
            onClearFilters={handleClearFilters}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />

          {/* Results */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-[#101828] text-[17px] font-[600]">
                {isLoading ? 'Loading...' : `${filteredResults.length} Results`}
              </h2>
              {pagination && (
                <p className="text-sm text-gray-500">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>
              )}
            </div>

            {isLoading ? (
              // Loading skeleton
              <div className="space-y-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="animate-pulse bg-white rounded-lg h-[225px]"
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="mt-[26px] flex flex-col gap-[19px]">
                  {filteredResults.map((result) => (
                    <SearchCard 
                      key={result._id} 
                      data={{
                        ...result,
                        id: result._id, // Ensure ID is properly passed
                        user_id: result.user_id,
                        category: result.category,
                        location: result.location,
                        username: result.username,
                        profilePic: result.profilePic,
                        about: result.about,
                        average_rating: result.average_rating,
                        total_reviews: result.total_reviews,
                        hourlyRate: result.hourlyRate,
                        workingDays: result.workingDays,
                        // Additional fields specific to each category
                        overNightCare: result.overnightCare,
                        schoolDropOff: result.schoolDrop,
                        mealPrice: result.mealPrice,
                        offerSubscription: result.offerSubscription,
                        serviceType: result.serviceType,
                        mealTypes: result.mealTypes,
                        ageBand: result.ageBand,
                        jobTiming: result.jobTiming,
                        mode: result.mode
                      }}
                    
                    />
                  ))}
                </div>

                {filteredResults.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[#475467] text-[15px]">
                      No results found for the selected criteria.
                    </p>
                    {(Object.keys(filters).length > 0 || searchTerm) && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-2 text-[#EF5744] text-[13px] hover:underline"
                      >
                        Clear all filters and search
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
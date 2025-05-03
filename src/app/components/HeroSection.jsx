// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function HeroSection() {
//   const [location, setLocation] = useState("");
//   const router = useRouter();

//   const handleSearch = () => {
//     // Encode the location for URL parameters
//     const searchParams = new URLSearchParams();
//     if (location) {
//       searchParams.append("location", location);
//     }
//     // Navigate to search page with location parameter
//     router.push(`/search?${searchParams.toString()}`);
//   };

//   return (
//     <div className="bg-[#FCF1E8] py-16">
//       <div className="flex flex-col-reverse md:flex-row justify-between p-6 max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20">
//         <div className="mt-10 md:mt-20 md:w-[49%]">
//           <div className="text-[#5A3E2B] font-[500] text-[39px] text-center md:text-start md:text-[60px] leading-[51px] heading">
//             Care Made for <span className="text-[#EF5744]">You</span>
//           </div>
//           <div className="text-[#8C746A] text-center md:text-start mt-[10px] md:mt-[30px] font-[400] text-[15px] md:text-[20px]">
//             Personalized support for every individual's needs.
//           </div>
//           <div>
//             <div className="bg-[#fff] flex rounded-full md:w-[93%] mt-5 md:mt-[36px] pl-6 pr-1 py-1 h-16 justify-between shadow-2xl">
//               <input
//                 type="text"
//                 placeholder="Enter location, City or State"
//                 className="text-[15px] font-[400] w-full outline-none border-none"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     handleSearch();
//                   }
//                 }}
//               />
//               <div 
//                 className="bg-[#EF5744] rounded-full px-7 flex items-center justify-center cursor-pointer"
//                 onClick={handleSearch}
//               >
//                 <img
//                   src="/Icons/search-normal.svg"
//                   alt=""
//                   className="h-[20px] invert filter"
//                 />
//               </div>
//             </div>
//             <div className="hidden md:flex mt-[56px] justify-between w-full md:w-[93%]">
//               <button 
//                 className="border border-[#EF5744] rounded-full px-[10px] py-[4px] text-[13px] font-[500] cursor-pointer text-[#101828] hover:bg-[#EF5744] hover:text-[#fff]"
//                 onClick={() => router.push('/search?type=Meal+Service')}
//               >
//                 Meal Service
//               </button>
//               <button 
//                 className="border border-[#EF5744] rounded-full px-[10px] py-[4px] text-[13px] font-[500] cursor-pointer text-[#101828] hover:bg-[#EF5744] hover:text-[#fff]"
//                 onClick={() => router.push('/search?type=Tutoring')}
//               >
//                 Tutoring
//               </button>
//               <button 
//                 className="border border-[#EF5744] rounded-full px-[10px] py-[4px] text-[13px] font-[500] cursor-pointer text-[#101828] hover:bg-[#EF5744] hover:text-[#fff]"
//                 onClick={() => router.push('/search?type=Child+care')}
//               >
//                 Child care
//               </button>
//               <button 
//                 className="border border-[#EF5744] rounded-full px-[10px] py-[4px] text-[13px] font-[500] cursor-pointer text-[#101828] hover:bg-[#EF5744] hover:text-[#fff]"
//                 onClick={() => router.push('/search?type=Mental+and+Physical+health')}
//               >
//                 Mental and Physical health
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="md:w-[51%] flex items-center justify-center">
//           <div className="">
//             <img src="/Images/care.png" alt="" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [showServices, setShowServices] = useState(false);
  const router = useRouter();

  const handleLocationSubmit = () => {
    if (location.trim()) {
      setShowServices(true);
    }
  };

  const handleServiceClick = (serviceType) => {
    // Build the search params with both location and service type
    const searchParams = new URLSearchParams();
    searchParams.append("location", location);
    searchParams.append("type", serviceType);
    
    // Navigate to search page with both parameters
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="bg-[#FCF1E8] py-16">
      <div className="flex flex-col-reverse md:flex-row justify-between p-6 max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20">
        <div className="mt-10 md:mt-20 md:w-[49%]">
          <div className="text-[#5A3E2B] font-[500] text-[39px] text-center md:text-start md:text-[60px] leading-[51px] heading">
            Care Made for <span className="text-[#EF5744]">You</span>
          </div>
          <div className="text-[#8C746A] text-center md:text-start mt-[10px] md:mt-[30px] font-[400] text-[15px] md:text-[20px]">
            Personalized support for every individual's needs.
          </div>
          <div>
            {!showServices && (
              <div className="bg-[#fff] flex rounded-full md:w-[93%] mt-5 md:mt-[36px] pl-6 pr-1 py-1 h-16 justify-between shadow-2xl">
                <input
                  type="text"
                  placeholder="Enter location, City or State"
                  className="text-[15px] font-[400] w-full outline-none border-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleLocationSubmit();
                    }
                  }}
                />
                <div 
                  className="bg-[#EF5744] rounded-full px-7 flex items-center justify-center cursor-pointer"
                  onClick={handleLocationSubmit}
                >
                  <img
                    src="/Icons/search-normal.svg"
                    alt=""
                    className="h-[20px] invert filter"
                  />
                </div>
              </div>
            )}

            {showServices && (
              <div className="mt-[36px] flex flex-wrap gap-4 w-full md:w-[93%]">
                <button 
                  className="border border-[#EF5744] rounded-full px-[20px] py-[8px] text-[15px] font-[500] cursor-pointer text-[#101828] hover:bg-[#EF5744] hover:text-[#fff]"
                  onClick={() => handleServiceClick('Meal Service')}
                >
                  Meal Service
                </button>
                <button 
                  className="border border-[#EF5744] rounded-full px-[20px] py-[8px] text-[15px] font-[500] cursor-pointer text-[#101828] hover:bg-[#EF5744] hover:text-[#fff]"
                  onClick={() => handleServiceClick('Tutoring')}
                >
                  Tutoring
                </button>
                <button 
                  className="border border-[#EF5744] rounded-full px-[20px] py-[8px] text-[15px] font-[500] cursor-pointer text-[#101828] hover:bg-[#EF5744] hover:text-[#fff]"
                  onClick={() => handleServiceClick('Child Care')}
                >
                  Child Care
                </button>
                <button 
                  className="border border-[#EF5744] rounded-full px-[20px] py-[8px] text-[15px] font-[500] cursor-pointer text-[#101828] hover:bg-[#EF5744] hover:text-[#fff]"
                  onClick={() => handleServiceClick('Mental & Physical')}
                >
                  Mental & Physical
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
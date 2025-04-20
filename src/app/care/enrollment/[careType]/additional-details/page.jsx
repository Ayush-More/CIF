"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import { useCareForm } from "../../../../context/CareFormContext";

export default function AdditionalDetails() {
  const { updateForm, formData } = useCareForm();
  const [isLoading, setIsLoading] = useState(false);
  const [zipCodeError, setZipCodeError] = useState("");
  
  // Common fields for all care types
  const [zipCode, setZipCode] = useState(formData.zipCode || "");
  const [location, setLocation] = useState(formData.location || "");
  const [experience, setExperience] = useState(formData.experience || "");
  
  // Tutoring specific fields
  const [mode, setMode] = useState(formData.mode || "");
  
  // Child care specific fields
  const [schoolDrop, setSchoolDrop] = useState(formData.schoolDrop || false);
  const [smoking, setSmoking] = useState(formData.smoking || false);
  const [overnightCare, setOvernightCare] = useState(formData.overnightCare || false);
  const [ageBand, setAgeBand] = useState(formData.ageBand || "");
  const [jobTiming, setJobTiming] = useState(formData.jobTiming || "");
  const [careFor, setCareFor] = useState(formData.careFor || 0);

  const handleIncrement = () => setCareFor((prev) => prev + 1);
  const handleDecrement = () => setCareFor((prev) => Math.max(prev - 1, 0));

  
  // Meal service specific fields
  const [travelDistance, setTravelDistance] = useState(formData.travelDistance || "");
  const [serviceType, setServiceType] = useState(formData.serviceType || "");
  const [mealPrice, setMealPrice] = useState(formData.mealPrice || "");
  const [offerSubscription, setOfferSubscription] = useState(formData.offerSubscription || false);
  const [mealTypes, setMealTypes] = useState(formData.mealTypes || []);
  
  const router = useRouter();
  const pathname = usePathname();
  const careType = pathname.split("/")[3];

  // Function to fetch location from zipcode using the postal pincode API
  const fetchLocationFromZipCode = async (zipCode) => {
    if (zipCode.length === 6) {
      setIsLoading(true);
      setZipCodeError("");
      
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${zipCode}`);
        const data = await response.json();
        
        if (data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setLocation(`${postOffice.District}, ${postOffice.State}`);
        } else {
          setZipCodeError("Invalid PIN code or no location found");
          setLocation("");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        setZipCodeError("Failed to fetch location. Please check your internet connection and try again.");
        setLocation("");
      } finally {
        setIsLoading(false);
      }
    } else if (zipCode.length > 0) {
      setLocation("");
    }
  };

  useEffect(() => {
    if (zipCode.length === 6) {
      fetchLocationFromZipCode(zipCode);
    }
  }, [zipCode]);

  const handleMealTypeToggle = (type) => {
    setMealTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const handleBackClick = () => {
    // Save form data before navigating back
    const formDataToUpdate = {
      zipCode,
      location,
      experience
    };

    // Add care type specific data
    if (careType === "tutoring") {
      formDataToUpdate.mode = mode;
    } else if (careType === "childcare") {
      formDataToUpdate.schoolDrop = schoolDrop;
      formDataToUpdate.smoking = smoking;
      formDataToUpdate.overnightCare = overnightCare;
      formDataToUpdate.ageBand = ageBand;
      formDataToUpdate.jobTiming = jobTiming;
      formDataToUpdate.careFor = careFor;
    } else if (careType === "mealservice") {
      formDataToUpdate.travelDistance = travelDistance;
      formDataToUpdate.serviceType = serviceType;
      formDataToUpdate.mealPrice = mealPrice;
      formDataToUpdate.offerSubscription = offerSubscription;
      formDataToUpdate.mealTypes = mealTypes;
    }

    updateForm(formDataToUpdate);
    router.back();
  };

  const handleNextClick = () => {
    setIsLoading(true);
    
    // Basic validation for common fields
    if (!zipCode || !experience || !location) {
      setIsLoading(false);
      alert("Please complete all required fields before proceeding.");
      return;
    }

    // Care type specific validation
    let isValid = true;
    if (careType === "tutoring" && !mode) {
      isValid = false;
    } else if (careType === "childcare" && (!ageBand || !jobTiming || careFor === 0)) {
      isValid = false;
    } else if (careType === "mealservice" && (!travelDistance || !serviceType || !mealPrice || mealTypes.length === 0)) {
      isValid = false;
    }

    if (!isValid) {
      setIsLoading(false);
      alert("Please complete all required fields for this service type.");
      return;
    }

    // Save form data
    const formDataToUpdate = {
      zipCode,
      location,
      experience
    };

    // Add care type specific data
    if (careType === "tutoring") {
      formDataToUpdate.mode = mode;
    } else if (careType === "childcare") {
      formDataToUpdate.schoolDrop = schoolDrop;
      formDataToUpdate.smoking = smoking;
      formDataToUpdate.overnightCare = overnightCare;
      formDataToUpdate.ageBand = ageBand;
      formDataToUpdate.jobTiming = jobTiming;
      formDataToUpdate.careFor = careFor;
    } else if (careType === "mealservice") {
      formDataToUpdate.travelDistance = travelDistance;
      formDataToUpdate.serviceType = serviceType;
      formDataToUpdate.mealPrice = mealPrice;
      formDataToUpdate.offerSubscription = offerSubscription;
      formDataToUpdate.mealTypes = mealTypes;
    }

    updateForm(formDataToUpdate);
    setIsLoading(false);
    router.push(`/care/enrollment/${formData.category}/personal-details`);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl px-6 mx-auto md:px-10 lg:px-14 xl:px-20 pt-30 pb-10">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#ffffffcc] z-10">
            <div className="loader"></div>
          </div>
        )}
        <div className="w-[55%] mx-auto">
          <h1 className="font-[600] text-[28px] text-center">
            Additional Details
          </h1>
          
          {/* Progress Steps */}
          <div className="flex justify-center">
            <div className="flex gap-5 items-center mt-8">
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/correct.svg" alt="" className="h-7" />
                <div className="text-[11px]">Service Type</div>
              </div>
              <div className="bg-[#EF5744] h-[2px] w-10 mb-7"></div>
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/correct.svg" alt="" className="h-7" />
                <div className="text-[11px]">Services</div>
              </div>
              <div className="bg-[#EF5744] h-[2px] w-10 mb-7"></div>
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/correct.svg" alt="" className="h-7" />
                <div className="text-[11px]">Availability</div>
              </div>
              <div className="bg-[#EF5744] h-[2px] w-10 mb-7"></div>
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/active.svg" alt="" className="h-7" />
                <div className="text-[11px]">Additional Details</div>
              </div>
              <div className="bg-[#EF5744] h-[2px] w-10 mb-7"></div>
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/unactive.svg" alt="" className="h-7" />
                <div className="text-[11px]">Personal Details</div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-8">
            {/* Common fields for all care types */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[15px] font-[500]">Zip Code</p>
                <input
                  type="text"
                  className="border text-[13px] px-4 py-2 rounded-full w-full"
                  placeholder="Enter zip code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  maxLength={6}
                />
                {zipCodeError && (
                  <p className="text-red-500 text-[12px] ml-2">{zipCodeError}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-[15px] font-[500]">Location</p>
                <input
                  type="text"
                  className="border text-[13px] px-4 py-2 rounded-full w-full bg-gray-100"
                  placeholder="District, State"
                  value={location}
                  readOnly
                />
              </div>
            </div>

            <div>
              <p className="text-[15px] font-[500]">Experience</p>
              <textarea
                className="border text-[13px] px-4 py-2 rounded-lg w-full mt-2"
                placeholder="Describe your experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                rows={3}
              />
            </div>

            {/* Conditional Fields Based on Care Type */}
            {careType === "tutoring" && (
              <div>
                <p className="text-[15px] font-[500]">Mode of Tutoring</p>
                <div className="flex gap-2 mt-2">
                  {["In-person", "Online", "Both"].map((modeOption) => (
                    <div
                      key={modeOption}
                      className={`border text-[13px] px-8 py-2 rounded-full cursor-pointer ${
                        mode === modeOption
                          ? "bg-[#EF5744] text-white"
                          : "border-[#0000001A]"
                      }`}
                      onClick={() => setMode(modeOption)}
                    >
                      {modeOption}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {careType === "childcare" && (
              <>
                <div>
                  <p className="text-[15px] font-[500]">Additional Checks</p>
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schoolDrop}
                        onChange={() => setSchoolDrop(!schoolDrop)}
                        className="h-4 w-4 accent-[#EF5744]"
                      />
                      <span className="text-[13px]">School Drop & Pick-up</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smoking}
                        onChange={() => setSmoking(!smoking)}
                        className="h-4 w-4 accent-[#EF5744]"
                      />
                      <span className="text-[13px]">I am a smoker</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={overnightCare}
                        onChange={() => setOvernightCare(!overnightCare)}
                        className="h-4 w-4 accent-[#EF5744]"
                      />
                      <span className="text-[13px]">I can do overnight care</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="text-[15px] font-[500]">Age Band</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"].map((age) => (
                      <div
                        key={age}
                        className={`border text-[13px] px-4 py-2 rounded-full cursor-pointer ${
                          ageBand === age
                            ? "bg-[#EF5744] text-white"
                            : "border-[#0000001A]"
                        }`}
                        onClick={() => setAgeBand(age)}
                      >
                        {age}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[15px] font-[500]">When do you need the job?</p>
                  <div className="flex gap-2 mt-2">
                    {["Right now", "Within a week", "1-2 months"].map((timing) => (
                      <div
                        key={timing}
                        className={`border text-[13px] px-4 py-2 rounded-full cursor-pointer ${
                          jobTiming === timing
                            ? "bg-[#EF5744] text-white"
                            : "border-[#0000001A]"
                        }`}
                        onClick={() => setJobTiming(timing)}
                      >
                        {timing}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[15px] font-[500]">I am comfortable caring for</p>
                  <div className="flex gap-4 mt-4 items-center">
                    <button
                      className="px-4 py-2 text-white bg-[#EF5744] rounded-full"
                      onClick={handleDecrement}
                    >
                      -
                    </button>
                    <span className="text-[15px] font-[500]">{careFor}</span>
                    <button
                      className="px-4 py-2 text-white bg-[#EF5744] rounded-full"
                      onClick={handleIncrement}
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            )}

            {careType === "mealservice" && (
              <>
                <div>
                  <p className="text-[15px] font-[500]">How far are you willing to travel?</p>
                  <div className="flex gap-2 mt-2">
                    {["1-5 km", "5-10 km", "10-15 km", "15+ km"].map((distance) => (
                      <div
                        key={distance}
                        className={`border text-[13px] px-4 py-2 rounded-full cursor-pointer ${
                          travelDistance === distance
                            ? "bg-[#EF5744] text-white"
                            : "border-[#0000001A]"
                        }`}
                        onClick={() => setTravelDistance(distance)}
                      >
                        {distance}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[15px] font-[500]">Provide service as</p>
                  <div className="flex gap-2 mt-2">
                    {["Caterer", "Meal Provider", "Both"].map((service) => (
                      <div
                        key={service}
                        className={`border text-[13px] px-4 py-2 rounded-full cursor-pointer ${
                          serviceType === service
                            ? "bg-[#EF5744] text-white"
                            : "border-[#0000001A]"
                        }`}
                        onClick={() => setServiceType(service)}
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[15px] font-[500]">Select price range for meals</p>
                  <div className="flex gap-2 mt-2">
                    {["$5-$10", "$10-$15", "$15-$20", "$20+"].map((price) => (
                      <div
                        key={price}
                        className={`border text-[13px] px-4 py-2 rounded-full cursor-pointer ${
                          mealPrice === price
                            ? "bg-[#EF5744] text-white"
                            : "border-[#0000001A]"
                        }`}
                        onClick={() => setMealPrice(price)}
                      >
                        {price}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[15px] font-[500]">Do you offer monthly subscriptions?</p>
                  <div className="flex gap-2 mt-2">
                    <div
                      className={`border text-[13px] px-8 py-2 rounded-full cursor-pointer ${
                        offerSubscription ? "bg-[#EF5744] text-white" : "border-[#0000001A]"
                      }`}
                      onClick={() => setOfferSubscription(true)}
                    >
                      Yes
                    </div>
                    <div
                      className={`border text-[13px] px-8 py-2 rounded-full cursor-pointer ${
                        offerSubscription === false ? "bg-[#EF5744] text-white" : "border-[#0000001A]"
                      }`}
                      onClick={() => setOfferSubscription(false)}
                    >
                      No
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[15px] font-[500]">Choose meals that you can provide</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Breakfast", "Lunch", "Dinner", "Snacks", "Desserts", "Special Diet"].map((meal) => (
                      <div
                        key={meal}
                        className={`border text-[13px] px-4 py-2 rounded-full cursor-pointer ${
                          mealTypes.includes(meal)
                            ? "bg-[#EF5744] text-white"
                            : "border-[#0000001A]"
                        }`}
                        onClick={() => handleMealTypeToggle(meal)}
                      >
                        {meal}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              className="w-20 rounded-full px-[22px] py-[9px] text-[13px] bg-[#e3e3e3] text-[#000] cursor-pointer"
              onClick={handleBackClick}
            >
              Back
            </button>
            <button
              className="w-20 rounded-full px-[22px] py-[9px] text-[13px] bg-[#EF5744] text-[#ffffff] cursor-pointer"
              onClick={handleNextClick}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for loader */}
      <style jsx global>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #ef5744;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import { useCareForm } from "../../../../context/CareFormContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Availability() {
  const { updateForm, formData } = useCareForm();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize state with formData or defaults
  const [selectedDays, setSelectedDays] = useState(formData.workingDays || []);
  const [selectedTiming, setSelectedTiming] = useState(formData.timings || "");
  const [languages, setLanguages] = useState(
    formData.languages && formData.languages.length > 0
      ? formData.languages
      : [{ id: 1, name: "", proficiency: "" }]
  );
  const [hourlyRate, setHourlyRate] = useState(formData.hourlyRate || 10);

  const router = useRouter();
  const pathname = usePathname();
  const careType = pathname.split("/")[3];

  const handleDayClick = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddLanguage = () => {
    if (languages.length >= 5) {
      toast.warning('Maximum 5 languages can be added', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }
    setLanguages([...languages, { id: languages.length + 1, name: "", proficiency: "" }]);
  };

  const handleRemoveLanguage = (id) => {
    if (languages.length === 1) {
      toast.warning('At least one language is required', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }
    setLanguages(languages.filter((language) => language.id !== id));
  };

  const handleLanguageChange = (id, field, value) => {
    setLanguages((prev) =>
      prev.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    );
  };

  const handleHourlyRateChange = (e) => {
    const value = parseInt(e.target.value);
    setHourlyRate(value);
  };

  const validateForm = () => {
    const errors = [];

    // Validate working days
    if (selectedDays.length === 0) {
      errors.push("Please select at least one working day");
    }

    // Validate timing
    if (!selectedTiming) {
      errors.push("Please select your preferred timing");
    }

    // Validate languages
    const hasEmptyLanguage = languages.some(
      lang => !lang.name || !lang.proficiency
    );
    if (hasEmptyLanguage) {
      errors.push("Please complete all language selections with both language and proficiency");
    }

    // Validate hourly rate
    if (!hourlyRate || hourlyRate < 10) {
      errors.push("Hourly rate must be at least $10");
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error(error, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
      return false;
    }

    return true;
  };

  const handleBackClick = async () => {
    const formDataToUpdate = {
      workingDays: selectedDays,
      timings: selectedTiming,
      languages: languages.filter(lang => lang.name && lang.proficiency), // Only save complete language entries
      hourlyRate: Number(hourlyRate),
    };

    updateForm(formDataToUpdate);
    router.back();
  };

  const handleNextClick = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataToUpdate = {
        workingDays: selectedDays,
        timings: selectedTiming,
        languages: languages.filter(lang => lang.name && lang.proficiency),
        hourlyRate: Number(hourlyRate),
      };

      updateForm(formDataToUpdate);
      toast.success('Availability details saved successfully!', {
        position: "top-right",
        autoClose: 2000
      });
      router.push(`/care/enrollment/${formData.category}/additional-details`);
    } catch (error) {
      toast.error('Failed to save availability details', {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
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
            Choose your preferred frequency and timing
          </h1>
          
          {/* Progress Steps section remains the same */}
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
                <img src="/Icons/active.svg" alt="" className="h-7" />
                <div className="text-[11px]">Availability</div>
              </div>
              <div className="bg-[#EF5744] h-[2px] w-10 mb-7"></div>
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/unactive.svg" alt="" className="h-7" />
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
            {/* Days Selection */}
            <div>
              <p className="text-[15px] font-[500] flex items-center">
                How often do you need to work?
                <span className="text-red-500 ml-1">*</span>
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, i) => (
                    <div
                      key={i}
                      className={`border text-[13px] px-8 py-2 rounded-full cursor-pointer ${
                        selectedDays.includes(day)
                          ? "bg-[#EF5744] text-white"
                          : "border-[#0000001A]"
                      }`}
                      onClick={() => handleDayClick(day)}
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Selected: {selectedDays.length ? selectedDays.join(", ") : "None"}
              </p>
            </div>

            {/* Timing Selection */}
            <div>
              <p className="text-[15px] font-[500] flex items-center">
                Choose Your Timing
                <span className="text-red-500 ml-1">*</span>
              </p>
              <div className="flex gap-2 mt-2">
                {["Daily", "Weekly", "Monthly"].map((timing, i) => (
                  <div
                    key={i}
                    className={`border text-[13px] px-8 py-2 rounded-full font-[500] cursor-pointer ${
                      selectedTiming === timing
                        ? "bg-[#EF5744] text-white"
                        : "border-[#0000001A]"
                    }`}
                    onClick={() => setSelectedTiming(timing)}
                  >
                    {timing}
                  </div>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <p className="text-[15px] font-[500] flex items-center">
                Language
                <span className="text-red-500 ml-1">*</span>
                <span className="text-[11px] text-gray-500 ml-2">(Max 5 languages)</span>
              </p>
              <div className="mt-2">
                {languages.map((language) => (
                  <div
                    className="flex gap-2 mb-2 items-center"
                    key={language.id}
                  >
                    <select
                      className="custom-select border text-[13px] px-8 py-2 rounded-full"
                      value={language.name}
                      onChange={(e) =>
                        handleLanguageChange(language.id, "name", e.target.value)
                      }
                    >
                      <option value="">Select Language</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="French">French</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                    <select
                      className="custom-select border text-[13px] px-8 py-2 rounded-full"
                      value={language.proficiency}
                      onChange={(e) =>
                        handleLanguageChange(language.id, "proficiency", e.target.value)
                      }
                    >
                      <option value="">Select Proficiency</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    {languages.length > 1 && (
                      <button
                        className="text-[#EF5744] font-[500] text-[14px] cursor-pointer"
                        onClick={() => handleRemoveLanguage(language.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {languages.length < 5 && (
                  <button
                    className="text-[#EF5744] font-[500] text-[14px] mt-2 cursor-pointer"
                    onClick={handleAddLanguage}
                  >
                    + Add Another Language
                  </button>
                )}
              </div>
            </div>

            {/* Hourly Rate Slider */}
            <div>
              <p className="text-[15px] font-[500] flex items-center">
                Select Your Hourly Rate
                <span className="text-red-500 ml-1">*</span>
              </p>
              <div className="mt-4">
                <p className="text-[20px] font-[600]">${hourlyRate}</p>
                <div className="mt-2 relative w-[80%] slider-container">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={hourlyRate}
                    onChange={handleHourlyRateChange}
                    className="w-full appearance-none cursor-pointer custom-slider"
                  />
                </div>
                
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button
              className="w-20 rounded-full px-[22px] py-[9px] text-[13px] bg-[#e3e3e3] text-[#000] cursor-pointer"
              onClick={handleBackClick}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              className="w-20 rounded-full px-[22px] py-[9px] text-[13px] bg-[#EF5744] text-[#ffffff] cursor-pointer"
              onClick={handleNextClick}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Next'}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
      
      {/* Existing styles remain the same */}
      <style jsx global>{`
        /* Custom slider container */
        .slider-container {
          height: 12px;
          padding: 0;
          position: relative;
        }

        /* Base slider styling */
        .custom-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 12px;
          border-radius: 6px;
          background: #fcddda;
          outline: none;
          position: relative;
          z-index: 1;
        }

        /* Filled area styling */
        .custom-slider::-webkit-slider-runnable-track {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(
            to right,
            #ef5744 0%,
            #ef5744
              calc(
                (var(--value) - var(--min)) * 100% / (var(--max) - var(--min))
              ),
            #fcddda
              calc(
                (var(--value) - var(--min)) * 100% / (var(--max) - var(--min))
              ),
            #fcddda 100%
          );
        }

        /* Filled area for Firefox */
        .custom-slider::-moz-range-track {
          height: 12px;
          border-radius: 6px;
          background: #fcddda;
        }

        .custom-slider::-moz-range-progress {
          height: 12px;
          border-radius: 6px 0 0 6px;
          background: #ef5744;
        }

        /* Thumb styling for Chrome, Safari, Opera */
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ef5744;
          cursor: pointer;
          border: none;
          margin-top: -6px; /* Center thumb vertically */
          position: relative;
          z-index: 2;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        /* Thumb styling for Firefox */
        .custom-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ef5744;
          cursor: pointer;
          border: none;
          position: relative;
          z-index: 2;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        /* Additional styles for the slider - using JS to dynamically set the background */
        .custom-slider {
          --min: 10;
          --max: 100;
          --value: ${hourlyRate};
        }
      `}</style>
    </>
  );
}
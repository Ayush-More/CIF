'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useCareForm } from '../../../context/CareFormContext';

export default function CareType() {
  const { updateForm , formData} = useCareForm();
  const [isLoading, setIsLoading] = useState(false); // NEW STATE
  const [selected, setSelected] = useState(formData.category);
  const router = useRouter();

    const data = [
    {
      label: "Child care",
      image: "/Images/childcare.svg",
      link: "/care/enrollment/childcare/availability",
      value: "childcare",
    },
    {
      label: "Mental and Physical health",
      image: "/Images/mentalphysical.svg",
      link: "/care/enrollment/mentalphysical/availability",
      value: "mentalphysical",
    },
    {
      label: "Meal Service",
      image: "/Images/mealservice.svg",
      link: "/care/enrollment/mealservice/availability",
      value: "mealservice",
    },
    {
      label: "Tutoring",
      image: "/Images/tutoring.svg",
      link: "/care/enrollment/tutoring/availability",
      value: "tutoring",
    },
  ];

  const handleNextClick = () => {
    setIsLoading(true); // Start loader
    if (selected) {
      updateForm({ category: selected });
      router.push(`/care/enrollment/${selected}/availability`); // Go to next step
    }
    setIsLoading(false); // Stop loader on error
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl px-6 mx-auto pt-30 pb-10">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#ffffffcc] z-10">
          <div className="loader"></div> {/* Spinner */}
        </div>
      )}
        <h1 className="font-semibold text-2xl text-center">
          Choose The Type of Service You Are Offering
        </h1>
        <div className="flex justify-center pb-8">
            <div className="flex gap-6 items-center mt-8">
              <div className="flex flex-col items-center gap-2 relative w-24">
                <img src="/Icons/correct.svg" alt="" className="h-7" />
                <div className="absolute top-8 text-[11px] text-center w-full">Service Type</div>
              </div>
              <div className="bg-[#EF5744] h-[2px] w-10"></div>
              <div className="flex flex-col items-center gap-2 relative w-24">
                <img src="/Icons/active.svg" alt="" className="h-7" />
                <div className="absolute top-8 text-[11px] text-center w-full">Services</div>
              </div>
              <div className="bg-[#EF5744] h-[2px] w-10"></div>
              <div className="flex flex-col items-center gap-2 relative w-24">
                <img src="/Icons/unactive.svg" alt="" className="h-7" />
                <div className="absolute top-8 text-[11px] text-center w-full">Availability</div>
              </div>
              <div className="bg-[#EAECF0] h-[2px] w-10"></div>
              <div className="flex flex-col items-center gap-2 relative w-24">
                <img src="/Icons/unactive.svg" alt="" className="h-7" />
                <div className="absolute top-8 text-[11px] text-center w-full">Personal</div>
              </div>
            </div>
          </div>

        <div className="flex justify-center gap-6 mt-8">
          {data.map((item) => (
            <div
              key={item.value}
              onClick={() => setSelected(item.value)}
              className={`flex flex-col items-center cursor-pointer transition-all ${
                selected === item.value ? 'border-2 border-[#EF5744] rounded-xl p-2' : ''
              }`}
            >
              <img src={item.image} alt={item.label} className="w-48" />
              <div className="text-center font-medium mt-3">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10 gap-4">
          <button
            className="w-20 px-4 py-2 bg-gray-300 text-black rounded-full"
            onClick={() => router.back()}
          >
            Back
          </button>
          <button
            disabled={!selected}
            className={`w-20 px-4 py-2 rounded-full ${
              selected ? 'bg-[#EF5744] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleNextClick}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}


import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function Modal({ data, onClose }) {
  const router = useRouter();

  const modalRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!data) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000008a]"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-4 md:p-6 w-[90%] max-w-[700px] flex flex-col md:flex-row gap-4"
      >
        <div className="md:w-[50%] h-[220px]">
          <img
            src={data.image}
            alt=""
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="w-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <h1 className="text-[17px] text-[#101828] font-[600]">
                {data.name}
              </h1>
              <div className="flex items-center gap-[5px]">
                <img src="/Icons/location.svg" alt="" className="h-[20px]" />
                <span className="text-[15px] font-[400]">
                  6391 Elgin St. Celina
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((item) => {
                    return (
                      <img
                        src="/Icons/star.svg"
                        alt=""
                        className="h-[20px]"
                        key={item}
                      />
                    );
                  })}
                </div>
                <span className="text-[#475467] text-[13px]">
                  (103 reviews)
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                document.body.style.overflow = "auto";
                router.push(`/profile/${data.id}`);
              }}
              className="cursor-pointer bg-[#EF5744] text-[#fff] rounded-full px-5 md:px-[22px] py-[9px] text-[13px]"
            >
              View Profile
            </button>
          </div>
          <div className="text-[13px] text-[#475467] mt-4 md:mt-0">
            {data.description}
          </div>
          <div>
            <h1 className="text-[15px] text-[#101828] font-[600] mt-4 md:mt-0">
              Highlights from the Shasta
            </h1>
            <div className="flex gap-[13px]">
              {data.treatments.map((treatment, index) => {
                return (
                  <button
                    key={index}
                    className={`text-[13px] mt-[8px] text-[#101828] px-[13px] py-[5px] rounded-md font-[500] ${
                      treatment === "Tutoring"
                        ? "bg-[#E9ECFF]"
                        : treatment === "Child Care"
                        ? "bg-[#E7F2FF]"
                        : "bg-[#EFFFDF]"
                    }`}
                  >
                    {treatment}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

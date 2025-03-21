export default function CareCard({ data, handleCardClick }) {
  return (
    <div className="bg-[#F9FAFB] p-[13px] border border-[#0000001A] rounded-2xl flex gap-[19px]">
      <div className="w-[30%] h-[230px]">
        <img
          src={data.image}
          alt=""
          className="rounded-xl h-full w-full object-cover"
        />
      </div>
      <div className="w-full pt-[3px] flex flex-col justify-between">
        <div className="flex justify-between px-[4px]">
          <div className="flex items-center gap-[5px]">
            <img src="/Icons/star.svg" alt="" className="h-[20px]" />
            <span className="font-[600] text-[18px]">4.5 (100)</span>
          </div>
          <div className="flex items-center gap-[5px]">
            <img src="/Icons/location.svg" alt="" className="h-[20px]" />
            <span className="text-[17px] font-[400]">
              6391 Elgin St. Celina
            </span>
          </div>
        </div>
        <div>
          <h1 className="text-[18px] text-[#101828] font-[600]">
            Shasta Weishampel
          </h1>
          <p className="text-[#475467] text-[13px] mt-[5px]">
            Here will be a short brief and see more action.{" "}
            <span className="font-[500]">see more</span>
          </p>
        </div>
        <div>
          <p className="text-[#475467] text-[13px]">Available Treatments</p>
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
        <div className="flex gap-[13px] mb-[13px]">
          <button className="cursor-pointer border border-[#EF5744] text-[#EF5744] rounded-full px-[24px] py-[10px] text-[14px]">
            Contact Us
          </button>
          <button
            onClick={() => {
              handleCardClick(data);
            }}
            className="cursor-pointer bg-[#EF5744] text-[#fff] rounded-full px-[24px] py-[10px] text-[14px]"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

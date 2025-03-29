import data from "../../../public/assets/data.js";
const { carecardData } = data;

export default function ProfileCard() {
  const data = carecardData[2];
  return (
    <div className="bg-white rounded-lg w-full flex flex-col md:flex-row gap-4">
      <div className="md:w-[40%] h-[225px]">
        <img
          src={data.image}
          alt=""
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <div className="w-full flex flex-col gap-[14px]">
        <div className="flex flex-col md:flex-row gap-2 justify-between items-start">
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
          </div>
          <div className="flex gap-2 items-center mt-[1px] md:mt-0">
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
            <span className="text-[#475467] text-[13px]">(103 reviews)</span>
          </div>
        </div>
        <div className="text-[13px] text-[#475467]">{data.description}</div>
        <div>
          <h1 className="text-[15px] text-[#101828] font-[600]">
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
  );
}

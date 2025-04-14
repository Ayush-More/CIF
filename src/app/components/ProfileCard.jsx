import data from "../../../public/assets/data.js";

export default function ProfileCard({data}) {
  return (
    <div className="bg-white rounded-lg w-full flex flex-col md:flex-row gap-4">
      <div className="md:w-[40%] h-[225px]">
        <img
          src={data?.profilePic}
          alt=""
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <div className="w-full flex flex-col gap-[14px]">
        <div className="flex flex-col md:flex-row gap-2 justify-between items-start">
          <div className="flex flex-col gap-1">
            <h1 className="text-[17px] text-[#101828] font-[600]">
              {data?.username}
            </h1>
            <div className="flex items-center gap-[5px]">
              <img src="/Icons/location.svg" alt="" className="h-[20px]" />
              <span className="text-[15px] font-[400]">
                {data?.location}
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
        <div className="text-[13px] text-[#475467]">{data?.about}</div>
        <div>
          <h1 className="text-[15px] text-[#101828] font-[600]">
            Highlights from the Shasta
          </h1>
          <div className="flex gap-[13px]">
           
          <button
                     className={`text-[13px] mt-[8px] text-[#101828] px-[13px] py-[5px] rounded-md font-[500] ${
                      data?.category === "tutoring"
                      ? "bg-[#E9ECFF]"
                      : data?.category === "childcare"
                      ? "bg-[#E7F2FF]"
                       : data?.category === "mentalphysical"
                      ? "bg-[#E7F2FF]"
                       : data?.category === "mealservice"
                      ? "bg-[#E9ECFF]]"
                      : "bg-[#EFFFDF]"
                    }`}
                  >
                    {data?.category}
                  </button>
          </div>
        </div>
      </div>
    </div>
  );
}

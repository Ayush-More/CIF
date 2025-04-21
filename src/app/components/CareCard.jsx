export default function CareCard({ data, handleCardClick }) {
  return (
    <div className="bg-[#F9FAFB] p-[13px] border border-[#0000001A] rounded-2xl flex flex-col md:flex-row gap-[19px]">
      <div className="md:w-[30%] h-[230px]">
        <img
          src={data?.profilePic}
          alt="profile pic"
          className="rounded-xl h-full w-full object-cover"
        />
      </div>
      <div className="w-full pt-[3px] flex flex-col justify-between">
        <div className="flex justify-between md:px-[4px]">
          <div className="flex items-center gap-[5px]">
            <img src="/Icons/star.svg" alt="" className="h-[20px]" />
            {/* <span className="font-[600] text-[18px]">{data?.rating} (100)</span> */}
            <span className="font-[600] text-[18px]">
            {data?.rating?.toFixed(1) || "0.0"} ({data?.total_reviews || 0})
          </span>
          </div>
          <div className="flex items-center gap-[5px]">
            <img src="/Icons/location.svg" alt="" className="h-[20px]" />
            <span className="text-[17px] font-[400]">
              {data?.location}
            </span>
          </div>
        </div>
        <div>
          <h1 className="text-[18px] text-[#101828] font-[600] mt-1 md:mt-0">
            {data?.username}
          </h1>
          <p className="text-[#475467] text-[13px] mt-[5px]">
            {data?.about.slice(0,40)}{" "}
            <span className="font-[500]">see more</span>
          </p>
        </div>
        <div>
          <p className="text-[#475467] text-[13px] mt-2 md:mt-0">Available Treatments</p>
          <div className="flex gap-[13px]">
            
                <button
                  className={`text-[13px] mt-[8px] text-[#101828] px-[13px] py-[5px] rounded-md font-[500] bg-[#E9ECFF]`}
                >
                  {data?.category}
                </button>
             
          </div>
        </div>
        <div className="flex gap-[13px] mb-[13px] mt-4 md:mt-0">
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

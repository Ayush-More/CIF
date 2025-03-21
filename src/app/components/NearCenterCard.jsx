const NearCenterCard = ({ data }) => {
  return (
    <div className="p-[13px] w-[410px] border border-[#bababaa5] rounded-3xl bg-[#F9FAFB] flex flex-col gap-[17px]">
      <div className="h-[230px]">
        <img
          src={`/Images/ImgSlider${data.id}.jpeg`}
          alt=""
          className="rounded-2xl w-full h-full object-cover"
        />
      </div>
      <div className="flex justify-between px-[4px]">
        <div className="flex items-center gap-[5px]">
          <img src="/Icons/star.svg" alt="" className="h-[20px]" />
          <span className="font-[500] text-[15px]">
            {data.total_rating} ({data.rating})
          </span>
        </div>
        <div className="flex items-center gap-[5px]">
          <img src="/Icons/location.svg" alt="" className="h-[20px]" />
          <span className="text-[17px]">{data.location}</span>
        </div>
      </div>
      <div className="px-[4px]">
        <p className="text-[17px] font-[600] text-[#101828]">{data.heading}</p>
        <p className="text-[12px] text-[#475467] mt-[5px]">
          Bradford Health Services is a drug and alcohol rehab located
        </p>
      </div>
      <div className="flex justify-between gap-[13px] mb-[13px]">
        <button className="cursor-pointer w-1/2 border border-[#EF5744] text-[#EF5744] rounded-full py-[10px] text-[14px]">
          Contact Us
        </button>
        <button className="cursor-pointer w-1/2 bg-[#EF5744] text-[#fff] rounded-full py-[10px] text-[14px]">
          View Website
        </button>
      </div>
    </div>
  );
};

export default NearCenterCard;

export default function ProfileOthers({data}) {
  return (
    <div className="w-full mt-8">
      <div>
        <h1 className="text-[#101828] text-[22px] font-[600] mb-3">
          Experiences
        </h1>
        <div className="flex gap-2 text-[#101828] text-[13px] font-[500] items-center">
          <img src="/Icons/star_u.svg" alt="" className="h-4" />7 Years Of
          Experience
        </div>
        <div className="text-[#475467] text-[13px] mt-4">
         {data?.about}
        </div>
        <img src="/Icons/trusted.svg" alt="" className="h-16 mt-4" />
      </div>
      <div className="mt-8">
        <h1 className="text-[#101828] text-[22px] font-[600] mb-3">
          Education
        </h1>
        <div className="text-[#101828] text-[14px]">
          BA In Physology - Stanford University - 2012
        </div>
      </div>
      <div className="mt-8">
        <h1 className="text-[#101828] text-[22px] font-[600] mb-3">
          Languages
        </h1>
        <div className="flex gap-3">
          <button className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]">
            <img src="/Icons/america.svg" alt="" className="h-[14px]"/>
            English
          </button>
          <button className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]">
            <img src="/Icons/india.svg" alt="" className="h-[18px]"/>
            India
          </button>
        </div>
      </div>
    </div>
  );
}

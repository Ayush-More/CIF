export default function HeroSection() {
  return (
    <div className="bg-[#FCF1E8] py-16">
      <div className="flex flex-col-reverse md:flex-row justify-between p-6 max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20">
        <div className="mt-10 md:mt-20 md:w-[49%]">
          <div className="text-[#5A3E2B] font-[500] text-[39px] text-center md:text-start md:text-[60px] leading-[51px] heading">
            Care Made for <span className="text-[#EF5744]">You</span>
          </div>
          <div className="text-[#8C746A] text-center md:text-start mt-[10px] md:mt-[30px] font-[400] text-[15px] md:text-[20px]">
            Personalized support for every individual’s needs.
          </div>
          <div>
            <div className="bg-[#fff] flex rounded-full md:w-[93%] mt-5 md:mt-[36px] pl-6 pr-1 py-1 h-16 justify-between shadow-2xl">
              <input
                type="text"
                placeholder="Enter location, City or State"
                className="text-[15px] font-[400] w-full outline-none border-none"
              />
              <div className="bg-[#EF5744] rounded-full px-7 flex items-center justify-center cursor-pointer">
                <img
                  src="/Icons/search-normal.svg"
                  alt=""
                  className="h-[20px] invert filter"
                />
              </div>
            </div>
            <div className="hidden md:flex mt-[56px] justify-between w-full md:w-[93%]">
              <button className="border border-[#EF5744] rounded-full px-[10px] py-[4px] text-[13px] font-[500] cursor-pointer text-[#101828] hover:bg-[#EF5744] hover:text-[#fff]">
                Meal Service
              </button>
              <button className="border border-[#EF5744] rounded-full px-[10px] py-[4px] text-[13px] font-[500] cursor-pointer text-[#101828] hover:bg-[#EF5744] hover:text-[#fff]">
                Tutoring
              </button>
              <button className="border border-[#EF5744] rounded-full px-[10px] py-[4px] text-[13px] font-[500] cursor-pointer text-[#101828] hover:bg-[#EF5744] hover:text-[#fff]">
                Child care
              </button>
              <button className="border border-[#EF5744] rounded-full px-[10px] py-[4px] text-[13px] font-[500] cursor-pointer text-[#101828] hover:bg-[#EF5744] hover:text-[#fff]">
                Mental and Physical health
              </button>
            </div>
          </div>
        </div>
        <div className="md:w-[51%] flex items-center justify-center">
          <div className="">
            <img src="/Images/care.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

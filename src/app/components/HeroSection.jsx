export default function HeroSection() {
  return (
    <div
      style={{
        // background: "linear-gradient(to right, #F9FAFB, #ffada2)",
      }}
    >
      <div className="flex justify-between p-6 max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20">
        <div className="mt-[18px] w-[49%]">
          <div className="text-[#6B7198] font-[500] text-[48px] leading-[51px]">
            Find <span className="text-[#EF5744]">Care</span> that is right for
            you or a loved one.
          </div>
          <div className="text-[#475467] mt-[13px] font-[400] text-[15px]">
            Our care programs are tailored to meet individual needs, offering
            personalized treatment plans in a supportive and compassionate
            environment.
          </div>
          <div>
            <div className="bg-[#F5F6F7] flex rounded-full w-[93%] mt-[19px] px-[15px] py-[9px] justify-between border border-[#cdcdcd]">
              <input
                type="text"
                placeholder="Enter location, City or State"
                className="text-[13px] placeholder:text-[#000] w-full outline-none border-none font-[500]"
              />
              <div>
                <img
                  src="/Icons/search-normal.svg"
                  alt=""
                  className="h-[22px]"
                />
              </div>
            </div>
            <div className="flex mt-[18px] justify-between w-[93%]">
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
            <button className="mt-[18px] bg-[#EF5744] rounded-full px-[22px] py-[9px] text-[#fff] cursor-pointer text-[15px]">
              Find A Care Now
            </button>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2">
          <div className="w-full flex gap-2">
            <div className="w-[169px] h-[169px] rounded-xl">
              <img src="/Images/meal.svg" alt="" />
            </div>
            <div
              className="w-[350px] h-[169px] rounded-xl"
              style={{
                backgroundImage: "url('/Images/Meditation_Image.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>
          <div className="w-full flex gap-2">
            <div className="w-[350px] h-[169px] rounded-xl">
              <img
                src="/Images/tut.svg"
                alt=""
                className="h-full object-cover"
              />
            </div>
            <div className="w-[169px] h-[169px] rounded-xl">
              <img src="/Images/childcarebg.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

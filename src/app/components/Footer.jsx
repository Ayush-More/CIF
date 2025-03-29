export default function Footer() {
  return (
    <div className="bg-[#081253] px-6 py-[50px] mt-20">
      <div className="max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20">
        <div className="flex flex-col gap-8 md:gap-0 md:flex-row justify-between">
          <div className="md:w-[25%]">
            <img
              src="/Icons/heartlogo.png"
              alt=""
              className="h-[49px] cursor-pointer"
            />
            <p className="text-[#FFFFFF99] md:text-[14px] mt-[28px] font-[400]">
              Design amazing digital experiences that create more happy in the
              world.
            </p>
          </div>
          <div>
            <span className="text-[#FFFFFF99] text-[13px]">Product</span>
            <ul className="text-[#fff] text-[14px] flex flex-col gap-[13px] mt-[13px] cursor-pointer">
              <li>Home</li>
              <li>Listings</li>
              <li>Treatment</li>
              <li>Tutorials</li>
              <li>Blogs</li>
            </ul>
          </div>
          <div>
            <span className="text-[#FFFFFF99] text-[13px]">Locations</span>
            <ul className="text-[#fff] text-[14px] flex flex-col gap-[13px] mt-[13px] cursor-pointer">
              <li>Blogs</li>
              <li>Newsletter</li>
              <li>Events</li>
              <li>Help center</li>
              <li>Tutorials</li>
              <li>Support</li>
            </ul>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-[13px] md:justify-between">
            <div className="bg-transparent flex gap-[13px] rounded-full px-[10px] py-[9px] justify-between border border-[#d8d8d870] w-full md:w-[65%]">
              <div>
                <img
                  src="/Icons/search-normal.svg"
                  alt=""
                  className="h-[24px] filter invert"
                />
              </div>
              <input
                type="text"
                placeholder="Enter location, City or State"
                className="text-[13px] placeholder:text-[#fff] w-full outline-none border-none font-[500] text-[#fff] pr-[38px]"
              />
            </div>
            <button className="bg-[#EF5744] rounded-full px-[22px] py-[9px] text-[#fff] cursor-pointer text-[15px]">
              Find A Care
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row mt-8 md:mt-[51px] border-t border-[#ffffff21] pt-[26px] gap-3 items-center md:items-start md:gap-[32px] text-[#fff] text-[14px]">
          <div>© 2024 Company. All rights reserved.</div>
          <div className="flex gap-[19px] cursor-pointer">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </div>
  );
}

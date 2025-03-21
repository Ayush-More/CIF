import "../stylesheets/LogoSlider.css";

export default function LogoSlider() {
  return (
    <div className="bg-[#EF5744]">
      <div className="flex mt-[64px] py-[26px] max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20">
        <div className="text-[#fff] w-[20%] text-[15px] border-r border-[#ffffff9a]">
          Join 4,000+ companies already growing
        </div>
        <div className="w-full moving">
          {[1, 2, 3].map((item) => {
            return (
              <div key={item} className="move">
                <img
                  className="inline-block w-[115px] mr-[31px]"
                  src="/Images/firstLogo.svg"
                  alt=""
                />
                <img
                  className="inline-block w-[115px] mr-[31px]"
                  src="/Images/secondLogo.svg"
                  alt=""
                />
                <img
                  className="inline-block w-[115px] mr-[31px]"
                  src="/Images/ThirdLogo.svg"
                  alt=""
                />
                <img
                  className="inline-block w-[115px] mr-[31px]"
                  src="/Images/fourthLogo.svg"
                  alt=""
                />
                <img
                  className="inline-block w-[115px] mr-[31px]"
                  src="/Images/fifthLogo.svg"
                  alt=""
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

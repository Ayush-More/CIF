import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import data from "../../../public/assets/data.js";
import { useState , useEffect } from "react";
import { listCareProfile } from "../services/auth";
import { useParams } from 'next/navigation';
const { carecardData } = data;

export default function Profile() {
  const data = carecardData[2];
const [cardData , setCardData] = useState(null)
const userId = useParams.user;
  const handleList = async()=>{
    const result = await listCareProfile(userId);
    setCardData(result)
  }
  console.log(cardData , 22222)
  useEffect(()=>{
    handleList()
    console.log(cardData , 22222)
  },[cardData])
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20 pt-20">
        <div className="bg-[#F2F3F4] md:mt-7 rounded-md flex flex-col gap-6 pt-8 pb-20 md:px-10 px-6">
          {/* profile upper section */}
          <div className="w-full flex flex-col-reverse md:flex-row items-start justify-between">
            <div className="md:w-[55%]">
              <div className="h-40 w-40 rounded-full overflow-hidden">
                <img
                  src={cardData.profilePic}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              </div>
              {/** profile card */}
              <div className="flex flex-col gap-2 mt-5">
                <h1 className="text-[17px] text-[#101828] font-[600]">
                  {cardData.username}
                </h1>
                <div className="flex items-center gap-[5px]">
                  <img src="/Icons/location.svg" alt="" className="h-[20px]" />
                  <span className="text-[15px] font-[400]">
                    {cardData.location}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
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
                  <span className="text-[#475467] text-[13px]">
                    (103 reviews)
                  </span>
                </div>
                <div className="text-[13px] text-[#475467] mt-3">
                  A luxury center treating addiction and co-occurring mental
                  health with evidence-based therapies, a continuum of care in
                  bespoke facilities, and private bedrooms.
                </div>
              </div>
            </div>
            <div className="flex gap-2 mb-4 md:mb-0 w-full justify-end">
              <button className="bg-[#EF5744] px-[19px] py-[8px] rounded-full text-[#fff] text-[14px] cursor-pointer">
                Repost
              </button>
              <button className="border border-[#EF5744] px-[19px] py-[8px] rounded-full text-[#EF5744] text-[14px] cursor-pointer">
                Edit Profile
              </button>
            </div>
          </div>

          {/* highlight section*/}
          <div>
            <h1 className="text-[16px] text-[#101828] font-[600]">
              Highlights from the Shasta
            </h1>
            <div className="flex gap-[13px]">
              
                  <button
                    key={index}
                    className={`text-[13px] mt-[8px] text-[#101828] px-[13px] py-[5px] rounded-md font-[500] ${
                      cardData.category === "tutoring"
                      ? "bg-[#E9ECFF]"
                      : cardData.category === "childcare"
                      ? "bg-[#E7F2FF]"
                       : cardData.category === "mentalphysical"
                      ? "bg-[#E7F2FF]"
                       : cardData.category === "mealservice"
                      ? "bg-[#E9ECFF]]"
                      : "bg-[#EFFFDF]"
                    }`}
                  >
                    {cardData.category}
                  </button>
                
            </div>
          </div>

          {/*education */}
          <div>
            <h1 className="text-[#101828] text-[20px] font-[600] mb-3">
              Education
            </h1>
            <div className="text-[#101828] text-[14px]">
              BA In Physology - Stanford University - 2012
            </div>
          </div>

          {/*language */}
          <div>
            <h1 className="text-[#101828] text-[20px] font-[600] mb-3">
              Languages
            </h1>
            <div className="flex gap-3">
              <button className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]">
                <img src="/Icons/america.svg" alt="" className="h-[14px]" />
                English
              </button>
              <button className="flex px-4 items-center bg-[#F2F3F4] rounded-3xl py-[9px] gap-2 text-[13px] font-[500]">
                <img src="/Icons/india.svg" alt="" className="h-[18px]" />
                India
              </button>
            </div>
          </div>

          {/*about */}
          <div>
            <h1 className="text-[#101828] text-[20px] font-[600] mb-2">
              About
            </h1>
            <div className="text-[#475467] text-[13px]">
              {cardData.about}
            </div>
          </div>

          {/*experience */}
          <div>
            <h1 className="text-[#101828] text-[20px] font-[600] mb-3">
              Experiences
            </h1>
            <div className="flex gap-2 text-[#101828] text-[13px] font-[500] items-center">
              <img src="/Icons/star_u.svg" alt="" className="h-4" />7 Years Of
              Experience
            </div>
            <div className="text-[#475467] text-[13px] mt-4">
              {cardData.skills}
            </div>
            <img src="/Icons/trusted.svg" alt="" className="h-16 mt-4" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

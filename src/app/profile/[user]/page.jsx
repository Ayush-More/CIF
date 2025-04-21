"use client";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import ProfileAbout from "../../components/ProfileAbout";
import ProfileCard from "../../components/ProfileCard";
import ProfileImages from "../../components/ProfileImages";
import ProfileOthers from "../../components/ProfileOthers";
import ProfileReview from "../../components/ProfileReview";
import { listCareProfile } from "./../../services/auth";
import { useParams } from 'next/navigation';
import { useState  , useEffect } from "react";

export default function Profile() {
  const [cardData , setCardData] = useState([])
  const params = useParams(); 
const userId = params.user;
console.log(userId , 88888)
  const handleList = async()=>{
    const result = await listCareProfile(userId);
    setCardData(result)
  }
  useEffect(()=>{
    handleList()
  },[])
  return (
    <>
      <Navbar />
      <div className="max-w-7xl px-6 mx-auto md:px-10 lg:px-14 xl:px-20 pt-20">
        <div className="flex mt-5 justify-between flex-col md:flex-row">
          <div className="md:w-[68%]">
            <ProfileCard data = {cardData?.data} />
            <ProfileAbout data = {cardData?.data} />
            {/* <ProfileImages data = {cardData.data}/> */}
            <ProfileOthers data = {cardData?.data}/>
          </div>
          <div className="md:w-[25%] mt-8 md:mt-0">
            <div className="border-2 sticky top-24 border-[#dadada84] w-full rounded-2xl p-[14px]">
              <h1 className="text-[18px] font-[700] text-[#101828]">
                Call Shasta Weishampel
              </h1>
              <p className="text-[12px] text-[#475467]">
                Connect with Shasta Weishampel by calling their admissions team
                directly.
              </p>
              <button className="bg-[#EF5744] flex text-[#fff] rounded-full px-[14px] py-[6px] items-center gap-2 w-full mt-3">
                <img src="/Icons/phone.svg" alt="" className="h-4" />
                0000-0000-0000
              </button>
            </div>
          </div>
        </div>
        <ProfileReview careId = {cardData?.data?._id}/>
      </div>
      <Footer />
    </>
  );
}

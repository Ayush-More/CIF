"use client";
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import ProfileAbout from "../../components/ProfileAbout";
import ProfileCard from "../../components/ProfileCard";
import ProfileImages from "../../components/ProfileImages";
import ProfileOthers from "../../components/ProfileOthers";
import ProfileReview from "../../components/ProfileReview";
import ReviewSection from "../../components/ReviewSection";
import { listCareProfile } from "./../../services/auth";
import { useRouter} from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams(); 
  const userId = params.user;

  const handleList = async() => {
    try {
      const result = await listCareProfile(userId);
      setCardData(result);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  const createChatRoom = async () => {
    const Id = localStorage.getItem('userId');
    if (!Id) {
        toast.error("Please login to chat");
        return;
    }

    setLoading(true);

    try {
        const response = await fetch(`/api/chat/create-chat-room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: userId,
                from: Id,
            }),
        });

        const responseData = await response.json();

        if (response.ok) {
            router.push(`/chat-page?roomID=${responseData.roomID}`);
        } else {
            throw new Error(responseData.message || "Failed to create chat room");
        }
    } catch (error) {
        console.error('Chat Room Error:', error);
        toast.error(error.message || "Error creating chat room");
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    handleList();
  }, [userId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl px-6 mx-auto md:px-10 lg:px-14 xl:px-20 pt-20">
          <div className="flex justify-center items-center h-[50vh]">
            <p>Loading profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl px-6 mx-auto md:px-10 lg:px-14 xl:px-20 pt-20">
        <div className="flex mt-5 justify-between flex-col md:flex-row">
          <div className="md:w-[68%]">
            <ProfileCard data={cardData?.data} />
            <ProfileAbout data={cardData?.data} />
            {/* <ProfileImages data={cardData?.data} /> */}
            <ProfileOthers data={cardData?.data} />
          </div>
          <div className="md:w-[25%] mt-8 md:mt-0">
            <div className="border-2 sticky top-24 border-[#dadada84] w-full rounded-2xl p-[14px]">
              <h1 className="text-[18px] font-[700] text-[#101828]">
                Call {cardData?.data?.username || "Care Provider"}
              </h1>
              <p className="text-[12px] text-[#475467]">
                Connect with {cardData?.data?.username || "Care Provider"} by calling their admissions team directly.
              </p>
              <button onClick={() =>createChatRoom()} className="bg-[#EF5744] flex text-[#fff] rounded-full px-[14px] py-[6px] items-center gap-2 w-full mt-3">
                <img src="/Icons/phone.svg" alt="" className="h-4" />
                Contact Now
              </button>
            </div>
          </div>
        </div>
        <ProfileReview careId={cardData?.data?._id} />
        {/* <ReviewSection
                careId={userId}
                initialReviews={care?.reviews || []}
                initialAverageRating={care.averageRating || 0}
                initialTotalReviews={care.totalReviews || 0}
            /> */}
      </div>
      <Footer />
    </>
  );
}

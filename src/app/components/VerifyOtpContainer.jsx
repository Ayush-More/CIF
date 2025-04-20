"use client";
import { useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation"; // Import useParams
import { AppContext } from "../context/AppContext.js";
import InputField from "./InputField";
import { verifyOtpOnEmail } from "../services/auth";

export default function VerifyOtpContainer() {
  const router = useRouter();
  const params = useParams(); // Get the params from the URL
  const { BASE_URL } = useContext(AppContext);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // NEW STATE

  // Extract userId from params
  const userId = params.userId;

  const handleVerifyOtp = async () => {
    setIsSubmitted(true);
    setErrors({});
    setIsLoading(true); // Show the loader

    if (!userId) {
      setErrors({ general: "User ID is missing in the URL" });
      setIsLoading(false); // Stop the loader
      return;
    }

    if (!otp) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      setIsLoading(false); // Stop the loader
      return;
    }

    try {
      const response = await verifyOtpOnEmail(BASE_URL, { userId, otp }); // Pass userId instead of email
      setIsLoading(false); // Stop the loader

      if (response.success) {
        router.push("/reset-password");
      } else {
        setErrors({ otp: response.message || "Invalid OTP" });
      }
    } catch (error) {
      setIsLoading(false); // Stop the loader
      setErrors({ general: error.message || "Something went wrong" });
    }
  };

  return (
    <div className="relative min-w-[400px] px-3 mt-25 py-4 rounded-xl border border-[#0000001A]">
      {/* Loader Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#ffffffcc] z-10">
          <div className="loader border-4 border-t-[#EF5744] border-gray-200 rounded-full w-8 h-8 animate-spin"></div>
        </div>
      )}

      <h1 className="text-[22px] font-[600]">Verify OTP</h1>
      <p className="text-[13px] text-[#475467]">
        Enter the OTP sent to your email
      </p>

      <div className="mt-5">
        <InputField
          type="text"
          label="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          error={errors.otp}
          isSubmitted={isSubmitted}
        />
      </div>

      {errors.general && (
        <p className="text-red-500 text-sm mt-2">{errors.general}</p>
      )}

      <button
        className="text-[#fff] bg-[#EF5744] w-full rounded-md text-[14px] mt-5 py-[8px] cursor-pointer"
        onClick={handleVerifyOtp}
        disabled={isLoading} // Disable button while loading
      >
        Verify OTP
      </button>
    </div>
  );
}
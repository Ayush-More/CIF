"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "../context/AppContext.js";
import InputField from "./InputField";
import { verifyOtpOnEmail } from "../services/auth";

export default function VerifyOtpContainer() {
  const router = useRouter();
  const { BASE_URL } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleVerifyOtp = async () => {
    setIsSubmitted(true);
    setErrors({});
    
    if (!email) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      return;
    }
    
    if (!otp) {
      setErrors(prev => ({ ...prev, otp: "OTP is required" }));
      return;
    }
    
    try {
      const response = await verifyOtpOnEmail(BASE_URL, { email, otp });
      if (response.success) {
        router.push("/reset-password");
      } else {
        setErrors({ otp: response.message || "Invalid OTP" });
      }
    } catch (error) {
      setErrors({ general: error.message || "Something went wrong" });
    }
  };

  return (
    <div className="min-w-[400px] px-3 py-4 rounded-xl border border-[#0000001A]">
      <h1 className="text-[22px] font-[600]">Verify OTP</h1>
      <p className="text-[13px] text-[#475467]">
        Enter the OTP sent to your email
      </p>

      <div className="mt-5">
        <p className="text-[14px] mb-2">Email</p>
        <InputField
          type="email"
          label="Email"
          value={email}
          onChange={(value) => setEmail(value)}
          placeholder="me@gmail.com"
          error={errors.email}
          isSubmitted={isSubmitted}
        />
      </div>

      <div className="mt-5">
        <p className="text-[14px] mb-2">OTP</p>
        <InputField
          type="text"
          label="OTP"
          value={otp}
          onChange={(value) => setOtp(value)}
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
      >
        Verify OTP
      </button>
    </div>
  );
} 
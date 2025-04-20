"use client";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext.js";
import InputField from "../components/InputField";
import { forgotPassword } from "../services/auth";

export default function ForgotPasswordContainer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { BASE_URL } = useContext(AppContext);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // NEW STATE

  const handleForgotPassword = async () => {
    setIsSubmitted(true);
    setErrors({});
    setIsLoading(true); // Show the spinner

    try {
      const response = await forgotPassword(BASE_URL, email);
      setIsLoading(false); // Stop the spinner

      if (response.success) {
        router.push(`/verify-otp/${response.userId}`);
      } else {
        setErrors({ email: response.message || "Failed to send OTP" });
      }
    } catch (error) {
      setIsLoading(false); // Stop the spinner
      setErrors({ email: error.message || "Something went wrong" });
    }
  };

  return (
    <div className="relative min-w-[400px] px-3 py-4 mt-25 rounded-xl border border-[#0000001A]">
      {/* Spinner Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#ffffffcc] z-10">
          <div className="loader border-4 border-t-[#EF5744] border-gray-200 rounded-full w-8 h-8 animate-spin"></div>
        </div>
      )}

      <h1 className="text-[22px] font-[600]">Forgot Password</h1>
      <p className="text-[13px] text-[#475467]">
        Enter your email below to reset your password
      </p>

      <div className="mt-5">
        <InputField
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="me@gmail.com"
          error={errors.email}
          isSubmitted={isSubmitted}
        />
      </div>

      <button
        className="text-[#fff] bg-[#EF5744] w-full rounded-md text-[14px] mt-5 py-[8px] cursor-pointer"
        onClick={handleForgotPassword}
        disabled={isLoading} // Disable button while loading
      >
        Get OTP
      </button>

      <div className="flex justify-center gap-5 mt-5 text-[13px]">
        Try to login with social media
      </div>

      <button
        className="w-full rounded-md text-[14px] mt-3 py-[8px] cursor-pointer border border-[#0000001A] flex justify-center gap-5"
        disabled={isLoading} // Disable button while loading
      >
        <FcGoogle className="text-[20px]" />
        Signup with Google
      </button>
    </div>
  );
}
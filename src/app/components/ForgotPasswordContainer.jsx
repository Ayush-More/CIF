"use client";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useState , useContext } from "react";
import { AppContext } from "../context/AppContext.js";
import InputField from "../components/InputField";
import { forgotPassword } from "../services/auth";

export default function ForgotPasswordContainer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { BASE_URL } = useContext(AppContext);
  const [errors, setErrors] = useState({}); 
  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleForgotPassword = async () => {
    setIsSubmitted(true);
    setErrors({}); 
    try {
      const response = await forgotPassword(BASE_URL , email);
      if (response.success) {
        router.push("/verify-otp");
      } else {
        setErrors({ email: response.message || "Failed to send OTP" });
      }
    } catch (error) {
      setErrors({ email: error.message || "Something went wrong" });
    }
  };

  return (
    <div className="min-w-[400px] px-3 py-4 rounded-xl border border-[#0000001A]">
      <h1 className="text-[22px] font-[600]">Forgot Password</h1>
      <p className="text-[13px] text-[#475467]">
        Enter your email below to reset your password
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

      <button className="text-[#fff] bg-[#EF5744] w-full rounded-md text-[14px] mt-5 py-[8px] cursor-pointer" onClick={handleForgotPassword}>
        Get OTP
      </button>
      <div className="flex justify-center gap-5 mt-5 text-[13px]">
        Try to login with social media
      </div>
      <button className="w-full rounded-md text-[14px] mt-3 py-[8px] cursor-pointer border border-[#0000001A] flex justify-center gap-5">
        <FcGoogle className="text-[20px]" />
        Signup with Google
      </button>
    </div>
  );
}
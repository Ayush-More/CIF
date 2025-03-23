"use client";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function ForgotPasswordContainer() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-w-[400px] px-3 py-4 rounded-xl border border-[#0000001A]">
      <h1 className="text-[22px] font-[600]">Forgot Password</h1>
      <p className="text-[13px] text-[#475467]">
        Enter your email below to reset your password
      </p>

      <div className="mt-5">
        <p className="text-[14px] mb-2">Email</p>
        <input
          type="email"
          className="w-full text-[13px] px-2 py-[8px] outline-none border border-[#0000001A] rounded-md"
          placeholder="me@gmail.com"
        />
      </div>

      <button className="text-[#fff] bg-[#EF5744] w-full rounded-md text-[14px] mt-5 py-[8px] cursor-pointer">
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

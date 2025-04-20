"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "../context/AppContext.js";
import InputField from "./InputField";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { resetPassword } from "../services/auth";

export default function ResetPasswordContainer() {
  const router = useRouter();
  const { BASE_URL } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // NEW STATE

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleResetPassword = async () => {
    setIsSubmitted(true);
    setErrors({});
    setIsLoading(true); // Show the loader

    // Basic validation
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      setIsLoading(false); // Stop the loader
      return;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      setIsLoading(false); // Stop the loader
      return;
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      setIsLoading(false); // Stop the loader
      return;
    }

    try {
      const response = await resetPassword(BASE_URL, { email, password });
      setIsLoading(false); // Stop the loader

      if (response.success) {
        router.push("/login");
      } else {
        setErrors({ general: response.message || "Failed to reset password" });
      }
    } catch (error) {
      setIsLoading(false); // Stop the loader
      setErrors({ general: error.message || "Something went wrong" });
    }
  };

  return (
    <div className="relative min-w-[400px] px-3 py-4 mt-10 rounded-xl border border-[#0000001A]">
      {/* Loader Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#ffffffcc] z-10">
          <div className="loader border-4 border-t-[#EF5744] border-gray-200 rounded-full w-8 h-8 animate-spin"></div>
        </div>
      )}

      <h1 className="text-[22px] font-[600]">Reset Password</h1>
      <p className="text-[13px] text-[#475467]">
        Enter your email and new password
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

      <div className="mt-5 relative">
        <InputField
          type={showPassword ? "text" : "password"}
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          error={errors.password}
          isSubmitted={isSubmitted}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center top-8"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible className="text-gray-400" />
          ) : (
            <AiOutlineEye className="text-gray-400" />
          )}
        </button>
      </div>

      <div className="mt-5 relative">
        <InputField
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          error={errors.confirmPassword}
          isSubmitted={isSubmitted}
        />
        <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center top-8"
        >
          {showConfirmPassword ? (
            <AiOutlineEyeInvisible className="text-gray-400" />
          ) : (
            <AiOutlineEye className="text-gray-400" />
          )}
        </button>
      </div>

      {errors.general && (
        <p className="text-red-500 text-sm mt-2">{errors.general}</p>
      )}

      <button
        className="text-[#fff] bg-[#EF5744] w-full rounded-md text-[14px] mt-5 py-[8px] cursor-pointer"
        onClick={handleResetPassword}
        disabled={isLoading} // Disable button while loading
      >
        Reset Password
      </button>
    </div>
  );
}
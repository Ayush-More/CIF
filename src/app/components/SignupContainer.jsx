"use client";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.js";
import InputField from "../components/InputField";
import { validateForm } from "../utils/validation";
import { signupUser, verifyOtp } from "../services/auth.js";
import { useCareForm } from './../context/CareFormContext';
import { signIn } from "next-auth/react";

export default function SignupContainer() {
  const { updateForm } = useCareForm();
  const { BASE_URL } = useContext(AppContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // NEW STATE

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm(formData, setErrors)) {
      try {
        setIsLoading(true); // Start loader
        const data = await signupUser(BASE_URL, {
          email: formData.email,
          fullName: formData.firstName + ` ` + formData.lastName,
          password: formData.password,
        });
        setIsLoading(false); // Stop loader

        if (data.message === "Otp has been sent successfully") {
          setShowOtp(true);
          updateForm({
            user_id: data.newUser._id,
          });
        } else {
          setErrors((prev) => ({
            ...prev,
            email: data.message || "Signup failed",
          }));
        }
      } catch (error) {
        setIsLoading(false); // Stop loader on error
        setErrors((prev) => ({
          ...prev,
          email: "An error occurred during signup",
        }));
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true); // Start loader
    await signIn("google", {
      callbackUrl: "/",
    });
    setIsLoading(false); // Stop loader
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true); // Start loader
    await signIn("facebook", {
      callbackUrl: "/",
    });
    setIsLoading(false); // Stop loader
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // Start loader
      const data = await verifyOtp(BASE_URL, {
        email: formData.email,
        otp: formData.otp,
      });
      setIsLoading(false); // Stop loader

      if (data.success) {
        router.push("/create");
      } else {
        setErrors((prev) => ({
          ...prev,
          otp: data.message || "Invalid OTP",
        }));
      }
    } catch (error) {
      setIsLoading(false); // Stop loader on error
      setErrors((prev) => ({
        ...prev,
        otp: "An error occurred during OTP verification",
      }));
    }
  };

  return (
    <div className="w-[400px] px-6 py-6 rounded-xl border border-[#0000001A] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#ffffffcc] z-10">
          <div className="loader"></div> {/* Spinner */}
        </div>
      )}
      <h1 className="text-[22px] font-[600]">
        {showOtp ? "Verify OTP" : "Signup"}
      </h1>
      <p className="text-[13px] text-[#475467]">
        {showOtp
          ? "Enter the OTP sent to your email"
          : "Enter the details below to create your account"}
      </p>

      {!showOtp ? (
        <form onSubmit={handleSignup}>
          <div className="mt-5 flex gap-2">
            <InputField
              label="First name"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              placeholder="first name"
              error={errors.firstName}
              isSubmitted={isSubmitted}
            />
            <InputField
              label="Last name"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              placeholder="last name"
              error={errors.lastName}
              isSubmitted={isSubmitted}
            />
          </div>
          <InputField
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="me@gmail.com"
            error={errors.email}
            isSubmitted={isSubmitted}
          />
          <InputField
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange("password")}
            placeholder="********"
            error={errors.password}
            isSubmitted={isSubmitted}
            isPassword={true}
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
          />
          <button
            type="submit"
            className="text-[#fff] bg-[#EF5744] w-full rounded-md text-[14px] mt-5 py-[8px] cursor-pointer"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Loading..." : "Signup"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpVerify}>
          <InputField
            type="text"
            label="OTP"
            value={formData.otp}
            onChange={handleChange("otp")}
            placeholder="Enter OTP"
            error={errors.otp}
            isSubmitted={true}
          />
          <button
            type="submit"
            className="text-[#fff] bg-[#EF5744] w-full rounded-md text-[14px] mt-5 py-[8px] cursor-pointer"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Loading..." : "Verify OTP"}
          </button>
        </form>
      )}

      {!showOtp && (
        <>
          <div className="flex items-center gap-5 mt-2">
            <div className="w-[48%] h-[1px] bg-[#0000001A]"></div>
            <span className="text-[16px]">or</span>
            <div className="w-[48%] h-[1px] bg-[#0000001A]"></div>
          </div>
          <button
            className="w-full rounded-md text-[14px] mt-3 py-[8px] cursor-pointer border border-[#0000001A] flex justify-center gap-5 hover:bg-[#F1F5F9]"
            onClick={handleGoogleLogin}
            disabled={isLoading} // Disable button while loading
          >
            <FcGoogle className="text-[20px]" />
            Signup with Google
          </button>
          <button
            className="w-full rounded-md text-[14px] mt-3 py-[8px] cursor-pointer border border-[#0000001A] flex justify-center gap-5 hover:bg-[#F1F5F9]"
            onClick={handleFacebookLogin}
            disabled={isLoading} // Disable button while loading
          >
            <img src="/Icons/facebook.svg" alt="" className="h-5" />
            Login with Facebook
          </button>
          <div className="text-center mt-5 text-[13px]">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="underline text-[#EF5744] cursor-pointer"
            >
              Log In
            </span>
          </div>
        </>
      )}
    </div>
  );
}
"use client";

import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext.js";
import InputField from "../components/InputField";
import { validateLoginForm } from "../utils/validation";
import { loginUser } from "../services/auth";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "./../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

export default function LoginContainer() {
  const { data: session, status } = useSession();
  const { setToken } = useAuth();
  const router = useRouter();
  const { BASE_URL } = useContext(AppContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasSetToken = useRef(false);

  // Handle Google authentication success
  useEffect(() => {
    if (status === 'authenticated' && session?.customToken && !hasSetToken.current) {
      hasSetToken.current = true;
      setToken(session.customToken);
      
      // Get userId from session or token
      const userId = session.user?.id || session.user?.userId;
      if (userId) {
        router.push(`/profile/NavProfile/${userId}`);
      } else {
        console.error('No user ID found in session');
        router.push('/');
      }
    }
  }, [session, status, setToken, router]);

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateLoginForm(formData, setErrors)) {
      setIsLoading(true);
      try {
        const result = await loginUser(BASE_URL, {
          email: formData.email,
          password: formData.password,
        });

        if (result.success && result.token) {
          setToken(result.token);
          router.push('/');
        } else {
          setErrors((prev) => ({
            ...prev,
            email: result.message || "Invalid email or password",
          }));
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrors((prev) => ({
          ...prev,
          email: "An error occurred during login",
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

useEffect(()=>{
  const handleCookie = async()=>{
    if (session?.customToken) {
      fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: session.customToken }),
          credentials: 'include', // Important!
      });
  }
  handleCookie();
  }
},[session])

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error('Google login error:', error);
      toast.error("Failed to login with Google");
      setIsLoading(false);
    }
  };

  // const handleFacebookLogin = () => {
  //   toast.info("Will be available soon.....", {
  //     position: "bottom-right",
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //   });
  // };

  return (
    <div className="w-[400px] px-6 py-6 rounded-xl border border-[#0000001A] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#ffffffcc] z-10">
          <div className="loader"></div> {/* Spinner */}
        </div>
      )}
      <h1 className="text-[22px] font-[600]">Login</h1>
      <p className="text-[13px] text-[#475467] mb-5">
        Enter your email below to login to your account
      </p>
      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange("email")}
          placeholder="me@gmail.com"
          error={errors.email}
          isSubmitted={isSubmitted}
        />
        <div className="mt-5">
          <div className="mb-2 flex w-full justify-between">
            <p className="text-[14px]">Password</p>
            <p
              onClick={() => router.push("/forgot-password")}
              className="text-[14px] text-[#EF5744] underline cursor-pointer"
            >
              Forgot Password ?
            </p>
          </div>
          <InputField
            type="password"
            value={formData.password}
            onChange={handleChange("password")}
            placeholder="********"
            error={errors.password}
            isSubmitted={isSubmitted}
            isPassword={true}
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
          />
        </div>
        <button
          type="submit"
          className="text-[#fff] bg-[#EF5744] w-full rounded-md text-[14px] mt-5 py-[8px] cursor-pointer"
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
      <div className="flex items-center gap-5 mt-2">
        <div className="w-[48%] h-[1px] bg-[#0000001A]"></div>
        <span className="text-[16px]">or</span>
        <div className="w-[48%] h-[1px] bg-[#0000001A]"></div>
      </div>
      <button
        className="w-full rounded-md text-[14px] mt-3 py-[8px] cursor-pointer border border-[#0000001A] flex justify-center gap-5 hover:bg-[#F1F5F9]"
        onClick={handleGoogleLogin}
        disabled={isLoading} // Disable button when loading
      >
        <FcGoogle className="text-[20px]" />
        Login with Google
      </button>
      {/* // <button
      //   className="w-full rounded-md text-[14px] mt-3 py-[8px] cursor-pointer border border-[#0000001A] flex justify-center gap-5 hover:bg-[#F1F5F9]"
      //   onClick={handleFacebookLogin}
      //   disabled={isLoading} // Disable button when loading
      // >
      //   <img src="/Icons/facebook.svg" alt="" className="h-5" />
      //   Login with Facebook
      // </button> */}
      <div className="text-center mt-5 text-[13px]">
        Don't have an account?{" "}
        <span
          onClick={() => router.push("/signup")}
          className="underline text-[#EF5744] cursor-pointer"
        >
          Sign up
        </span>
      </div>
      <ToastContainer />
    </div>
  );
}
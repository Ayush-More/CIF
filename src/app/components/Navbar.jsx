"use client";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { AppContext } from "../context/AppContext";
import jwtDecode from "jwt-decode"; // Import if you want to decode the token
import { useAuth } from "./../context/AuthContext";
import { UserCircle2 } from "lucide-react"; // Import the profile icon

export default function Navbar() {
  const { userData } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [showDropdown, setShowDropdown] = useState(false);
  const { setIsOpen } = useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (pathname === "/") {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    // Check if the user is logged in by checking the token in cookies or local storage
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]; // Extract token from cookies

    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token if needed
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setIsLoggedIn(true); // Token is valid, user is logged in
        } else {
          setIsLoggedIn(false); // Token is expired
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false); // No token found
    }
  }, []);

  const handleLogout = () => {
    // Clear the token from cookies or local storage
    document.cookie = "token=; Max-Age=0"; // Clear the token cookie
    setIsLoggedIn(false);
    router.push("/login"); // Redirect to login page
  };

    return (
      <div
        className={`flex justify-center fixed top-0 w-full z-10 ${
          pathname === "/"
            ? isScrolled
              ? "bg-white shadow-md"
              : "bg-transparent"
            : "bg-white shadow-md"
        }`}
      >
        <div
          className={`flex py-4 justify-between pl-3 pr-4 max-w-7xl md:px-10 lg:px-14 xl:px-20 w-full items-center`}
        >
          <div className="flex items-center">
            <img
              onClick={() => {
                router.push("/");
              }}
              src="/Icons/heartlogo.png"
              alt=""
              className="h-[50px] cursor-pointer"
            />
          </div>
          <div>
            <ul className="hidden md:flex items-center gap-[35px] text-[14px] cursor-pointer">
              <Link href={"/"} className="hover:text-[#EF5744]">
                Home
              </Link>
              <Link href={"/search"} className="hover:text-[#EF5744]">
                Search
              </Link>
              <Link href={"/"} className="hover:text-[#EF5744]">
                About us
              </Link>
              <div className="relative">
                <div
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                  className="hover:text-[#EF5744]"
                >
                  Type of Cares
                  {showDropdown && (
                    <div className="absolute top-full left-0 bg-white shadow-md rounded-md py-2 min-w-[200px]">
                      <Link href="/services/meal-service" className="block px-4 py-2 hover:bg-gray-100">
                        Meal Service
                      </Link>
                      <Link href="/services/child-care" className="block px-4 py-2 hover:bg-gray-100">
                        Child Care
                      </Link>
                      <Link href="/services/physical-service" className="block px-4 py-2 hover:bg-gray-100">
                        Physical Service
                      </Link>
                      <Link href="/services/tutoring" className="block px-4 py-2 hover:bg-gray-100">
                        Tutoring
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </ul>
          </div>
          <div className="hidden md:flex items-center gap-[26px]">
            {userData ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <UserCircle2
                    size={32}
                    className="text-[#EF5744] cursor-pointer"
                    onClick={() => router.push('/profile')}
                  />
                </div>
              </div>
            ) : (
              <>
                <span
                  onClick={() => {
                    router.push("/login");
                  }}
                  className="text-[14px] cursor-pointer hover:text-[#EF5744]"
                >
                  Login
                </span>
                <button
                  onClick={() => {
                    router.push("/signup");
                  }}
                  className="bg-[#EF5744] px-[19px] py-[8px] rounded-full text-[#fff] text-[14px] cursor-pointer"
                >
                  Join now
                </button>
              </>
            )}
          </div>
          <div
            onClick={() => {
              setIsOpen(true);
            }}
            className="md:hidden flex flex-col items-end cursor-pointer transition-all duration-500"
          >
            <span className="block h-[3px] w-5 bg-[#000]"></span>
            <span className="block h-[3px] w-7.5 bg-[#000] mt-2"></span>
            <span className="block h-[3px] w-5 bg-[#000] mt-2"></span>
          </div>
        </div>
      </div>
    );
  }
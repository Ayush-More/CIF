"use client";
import { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { UserCircle2 } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { signOut, useSession } from "next-auth/react";
import { useAuth } from "./../context/AuthContext";

export default function Navbar() {
  const { isOpen, setIsOpen } = useContext(AppContext);
  const { data: session, status } = useSession();
  const { logout: authLogout, userData } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [error, setError] = useState(null);
  const [showCareTypes, setShowCareTypes] = useState(false);
  const careTypesRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();
  const profileMenuRef = useRef(null);

  // Verify token with backend
  const verifyAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.authenticated) {
        setIsAuthenticated(true);
        setUserInfo(data.user);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('email', data.user.email);
      } else {
        setIsAuthenticated(false);
        setUserInfo(null);
        
        // If we're on a protected route, redirect to login
        if (pathname === '/search' || pathname === '/profile') {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      setError('Authentication failed. Please try again.');
      setIsAuthenticated(false);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial auth check
  useEffect(() => {
    verifyAuth();
  }, []);

  // Sync authentication states
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session) {
      setIsAuthenticated(true);
      if (!userInfo) {
        verifyAuth();
      }
    } else if (status === 'unauthenticated' && !userData) {
      setIsAuthenticated(false);
      setUserInfo(null);
    }
  }, [status, session]);

  // Also check userData from AuthContext
  useEffect(() => {
    if (userData) {
      setIsAuthenticated(true);
      setUserInfo(prev => prev || { id: userData.userId, email: userData.email, name: userData.name });
      setLoading(false);
    }
  }, [userData]);

  const careTypes = [
    "Tutoring",
    "Child Care",
    "Meal Service",
    "Mental and Physical Health"
  ];

    // Handle click outside of care types dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (careTypesRef.current && !careTypesRef.current.contains(event.target)) {
        setShowCareTypes(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCareTypeSelect = (type) => {
    setShowCareTypes(false);
    router.push(`/search?type=${encodeURIComponent(type)}`);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // First, sign out from NextAuth
      await signOut({ redirect: false });
      
      // Then, clear the custom token
      await authLogout();
      
      // Clear local storage
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      
      // Update local state
      setIsAuthenticated(false);
      setUserInfo(null);
      setShowProfileMenu(false);
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'auth_trigger') {
        verifyAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    if (pathname === "/") {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Handle click outside profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div className="flex py-4 justify-between pl-3 pr-4 max-w-7xl md:px-10 lg:px-14 xl:px-20 w-full items-center">
    {/* // <nav className={`fixed w-full z-50 bg-white ${isScrolled ? "shadow-md" : ""}`}>
    //   <div className="flex justify-between items-center py-4 px-6 max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20"> */}
        {/* Logo */}
        <div className="flex items-center">
          <img
            onClick={() => router.push("/")}
            src="/Icons/heartlogo.png"
            alt=""
            className="h-[50px] cursor-pointer"
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-[#EF5744]">
              Home
            </Link>
            <Link href="/search" className="hover:text-[#EF5744]">
              Search
            </Link>
            <Link href="/about" className="hover:text-[#EF5744]">
              About us
            </Link>
            <Link href="/chat-page" className="hover:text-[#EF5744]">
              Chat
            </Link>
         <div className="relative" ref={careTypesRef}>
            <button
              className="text-[15px] font-[500] flex items-center gap-1"
              onClick={() => setShowCareTypes(!showCareTypes)}
            >
              Types of Cares
              <svg
                className={`w-4 h-4 transition-transform ${
                  showCareTypes ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {showCareTypes && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                {careTypes.map((type, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 text-[14px] hover:bg-gray-100"
                    onClick={() => handleCareTypeSelect(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-[26px]">
          {loading ? (
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
          ) : (isAuthenticated || status === 'authenticated' || userData) ? (
            <div className="relative" ref={profileMenuRef}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF5744] to-[#FF8066] p-[2px] transition-all duration-300 transform hover:scale-105">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <svg 
                      viewBox="0 0 24 24" 
                      width="30" 
                      height="30" 
                      fill="#EF5744"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push(`/profile/NavProfile/${userInfo?.id || userData?.userId}`);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    {loading ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <span
                onClick={() => router.push("/login")}
                className="text-[14px] cursor-pointer hover:text-[#EF5744]"
              >
                Login
              </span>
              <button
                onClick={() => router.push("/signup")}
                className="bg-[#EF5744] px-[19px] py-[8px] rounded-full text-[#fff] text-[14px] cursor-pointer"
              >
                Join now
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div
           onClick={() => setIsOpen(!isOpen)} // Toggle Navbar visibility
          className="md:hidden flex flex-col items-end cursor-pointer transition-all duration-500"
        >
          <span className="block h-[3px] w-5 bg-[#000]"></span>
          <span className="block h-[3px] w-7.5 bg-[#000] mt-2"></span>
          <span className="block h-[3px] w-5 bg-[#000] mt-2"></span>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>

  );
}
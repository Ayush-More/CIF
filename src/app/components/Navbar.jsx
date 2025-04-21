"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { UserCircle2 } from "lucide-react";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [error, setError] = useState(null);
  
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

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setUserInfo(null);
        // Trigger auth state update in other tabs
        window.localStorage.setItem('auth_trigger', Date.now().toString());
        router.push('/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify auth on mount and every 5 minutes
  useEffect(() => {
    verifyAuth();
    const interval = setInterval(verifyAuth, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

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
        <div>
          <ul className="hidden md:flex items-center gap-[35px] text-[14px] cursor-pointer">
            <Link href="/" className="hover:text-[#EF5744]">
              Home
            </Link>
            <Link href="/search" className="hover:text-[#EF5744]">
              Search
            </Link>
            <Link href="/" className="hover:text-[#EF5744]">
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

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-[26px]">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : isAuthenticated && userInfo ? (
            <div className="relative" ref={profileMenuRef}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserCircle2
                  size={32}
                  className="text-[#EF5744]"
                />
              </div>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/profile');
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
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
          onClick={() => setIsOpen(true)}
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
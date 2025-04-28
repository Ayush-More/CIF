"use client";
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navbarData = [
  { name: "Home", link: "/" },
  { name: "Search", link: "/search" },
  { name: "About Us", link: "/" },
  {
    name: "Types of Cares",
    link: "/search",
    subitem: [
      "Tutoring",
      "Child Care",
      "Meal Care",
      "Mental and Physical Health",
    ],
  },
  { name: "Chat", link: "/chat" },
];

export default function Sidebar() {
  const { isOpen, setIsOpen } = useContext(AppContext);
  const [openItems, setOpenItems] = useState({});
  const router = useRouter();

  const toggleSubitems = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleItemClick = (item, index) => {
    if (item.subitem) {
      toggleSubitems(index);
    } else {
      setIsOpen(false);
    }
  };

  const handleSubitemClick = (sub) => {
    setIsOpen(false);
    router.push(`/search?query=${encodeURIComponent(sub)}`);
  };

  return (
    <div
      className={`bg-[#FCF1E8] py-6 h-screen w-screen fixed top-0 z-40 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-400`}
    >
      <div className="flex pl-4 pr-6 justify-between items-center">
        <img
          src="/Icons/heartlogo.png"
          alt=""
          className="h-[50px] cursor-pointer"
        />
        <div
          onClick={() => setIsOpen(false)}
          className="bg-[#EF5744] w-8 h-8 flex items-center justify-center rounded-[4px]"
        >
          <svg
            stroke="currentColor"
            fill="#fff"
            strokeWidth="0"
            viewBox="0 0 384 512"
            className="text-xl"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
          </svg>
        </div>
      </div>

      <div className="px-6 mt-10">
        <div className="flex flex-col cursor-pointer">
          {navbarData.map((item, index) => (
            <div key={index}>
              <div
                className="flex justify-between items-center h-14"
                onClick={() => handleItemClick(item, index)}
              >
                <Link
                  href={item.link}
                  className="flex-1 hover:text-[#EF5744] text-[#8C746A] font-[500]"
                >
                  {item.name}
                </Link>
                {item.subitem && (
                  <p className="font-[500] text-[#8C746A] text-[25px] cursor-pointer">
                    {openItems[index] ? "-" : "+"}
                  </p>
                )}
              </div>
              <div className="h-[2px] bg-[#8c746a1d]"></div>
              <div
                className={`overflow-hidden transition-all duration-500 flex flex-col gap-2 ${
                  openItems[index]
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {item.subitem &&
                  item.subitem.map((sub, subIndex) => (
                    <div
                      key={subIndex}
                      onClick={() => handleSubitemClick(sub)}
                      className="cursor-pointer"
                    >
                      <p className="text-[#8C746A] font-[500] pl-5 text-[14px] hover:text-[#EF5744] h-12 flex items-center">
                        {sub}
                      </p>
                      <div className="h-[2px] bg-[#8c746a1d]"></div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex px-6 mt-10 items-center gap-[26px]">
        <span
          onClick={() => {
            setIsOpen(false);
            router.push("/login");
          }}
          className="text-[16px] cursor-pointer font-[500] text-[#8C746A]"
        >
          Login
        </span>
        <button
          onClick={() => {
            setIsOpen(false);
            router.push("/signup");
          }}
          className="bg-[#EF5744] px-[19px] py-[8px] rounded-full text-[#fff] text-[14px] cursor-pointer"
        >
          Join now
        </button>
      </div>
    </div>
  );
}

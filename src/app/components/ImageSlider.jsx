import { link } from "fs";
import { FaArrowRight } from "react-icons/fa6";

const bannerData = [
  {
    img: "/Images/create.png",
    title: "Tutoring",
  },
  {
    img: "/Images/cc1.jpeg",
    title: "Child Care",
  },
  {
    img: "/Images/mm1.jpeg",
    title: "Meal Care",
  },
  {
    img: "/Images/Meditation_Image.jpeg",
    title: "Mental and Phys...",
  },
];

export default function ImageSlider() {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-16">
      {bannerData.map((item, i) => {
        return (
          <div
            key={i}
            className="h-[260px] md:w-[300px] rounded-2xl overflow-hidden relative"
          >
            <img
              src={item.img}
              alt=""
              className="h-full w-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
            />
            <div className="absolute bottom-0 w-full h-16 flex justify-between px-4 items-center">
              <div className="text-[#fff] bg-[#000000a7] px-4 py-1 rounded-md text-[16px] heading">
                {item.title}
              </div>
              <div className="w-[31px] h-[31px] cursor-pointer hover:scale-125 transition-transform duration-300 bg-[#fff] rounded-full flex items-center justify-center">
                <FaArrowRight className="text-[14px]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

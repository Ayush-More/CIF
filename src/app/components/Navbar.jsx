import Link from "next/link";
export default function Navbar() {
  return (
    <div className="flex py-4 justify-between">
      <div className="flex items-center gap-20">
        <img src="/Images/Logo.svg" alt="" className="w-[230px] cursor-pointer"/>
        <ul className="flex items-center gap-[35px] text-[13px] cursor-pointer">
            <Link href={"/"}>Home</Link>
            <Link href={"/search"}>Search</Link>
            <Link href={"/"}>About us</Link>
            <Link href={"/"}>Type of Cares</Link>
            <Link href={"/"}>Blogs</Link>
        </ul>
      </div>
      <div className="flex items-center gap-[26px]">
        <span className="text-[13px] cursor-pointer">Login</span>
        <button className="bg-[#EF5744] px-[19px] py-[8px] rounded-full text-[#fff] text-[13px] cursor-pointer">Join now</button>
      </div>
    </div>
  );
}

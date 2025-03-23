"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../../components/Navbar";

export default function PersonalData() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [aboutYourself, setAboutYourself] = useState("");
  const [aboutSkills, setAboutSkills] = useState("");
  const router = useRouter();

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextClick = () => {
    if (
      username &&
      gender &&
      dob &&
      aboutYourself &&
      aboutSkills &&
      profilePicture
    ) {
      router.push("/"); // Redirect to the home page
    } else {
      alert("Please fill all the fields and upload a profile picture.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20 pt-24 pb-10">
        <div className="w-[55%] mx-auto">
          <h1 className="font-[600] text-[28px]">Personal Details</h1>
          <div className="flex justify-center">
            <div className="flex gap-5 items-center mt-8">
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/correct.svg" alt="" className="h-7" />
                <div className="text-[11px]">Service Type</div>
              </div>
              <div className="bg-[#EF5744] h-[2px] w-10 mb-7"></div>
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/correct.svg" alt="" className="h-7" />
                <div className="text-[11px]">Services</div>
              </div>
              <div className="bg-[#EF5744] h-[2px] w-10 mb-7"></div>
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/correct.svg" alt="" className="h-7" />
                <div className="text-[11px]">Availability</div>
              </div>
              <div className="bg-[#EF5744] h-[2px] w-10 mb-7"></div>
              <div className="flex flex-col items-center gap-2">
                <img src="/Icons/active.svg" alt="" className="h-7" />
                <div className="text-[11px]">Personal Details</div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <div className="w-full flex flex-col items-center gap-2 justify-center">
              <label
                htmlFor="profilePicture"
                className="h-[140px] w-[140px] rounded-full border p-5 border-[#0000001A] flex flex-col gap-1 items-center justify-center cursor-pointer"
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <>
                    <img src="/Icons/upload.svg" alt="" />
                    <div className="text-[8px] text-center">
                      <span className="font-[600]">Click to upload</span> or
                      drag and drop PNG or JPG
                    </div>
                  </>
                )}
              </label>
              <input
                type="file"
                id="profilePicture"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handlePictureUpload}
              />
              <span className="font-[600] text-[14px]">Profile Picture</span>
            </div>
            <div className="flex flex-col gap-5 mt-8">
              <div className="w-full">
                <p className="text-[13px] font-[500] mb-1">Username</p>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-[12px] px-2 py-[6px] outline-none border border-[#0000001A] rounded-md"
                />
              </div>
              <div className="w-full flex gap-3">
                <div className="w-1/2">
                  <p className="text-[13px] font-[500] mb-1">Gender</p>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full text-[12px] px-2 py-[6px] outline-none border border-[#0000001A] rounded-md"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <p className="text-[13px] font-[500] mb-1">Date of Birth</p>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full text-[12px] px-2 py-[6px] outline-none border border-[#0000001A] rounded-md"
                  />
                </div>
              </div>
              <div className="w-full flex gap-3">
                <div className="w-1/2">
                  <p className="text-[13px] font-[500] mb-1">About Yourself</p>
                  <textarea
                    value={aboutYourself}
                    onChange={(e) => setAboutYourself(e.target.value)}
                    className="h-36 w-full text-[12px] px-3 py-[6px] outline-none border border-[#0000001A] rounded-md"
                  ></textarea>
                </div>
                <div className="w-1/2">
                  <p className="text-[13px] font-[500] mb-1">
                    About Your Skills
                  </p>
                  <textarea
                    value={aboutSkills}
                    onChange={(e) => setAboutSkills(e.target.value)}
                    className="h-36 w-full text-[12px] px-3 py-[6px] outline-none border border-[#0000001A] rounded-md"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8 gap-4">
              <button
                className="w-20 rounded-full px-[22px] py-[9px] text-[13px] bg-[#e3e3e3] text-[#000] cursor-pointer"
                onClick={() => router.back()}
              >
                Back
              </button>
              <button
                className={`w-20 rounded-full px-[22px] py-[9px] text-[13px] bg-[#EF5744] text-[#ffffff] cursor-pointer`}
                onClick={handleNextClick}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

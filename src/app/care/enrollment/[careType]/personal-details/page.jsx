"use client";
import { useState , useContext } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "./../../../../context/AppContext";
import Navbar from "../../../../components/Navbar";
import { useCareForm } from '../../../../context/CareFormContext';
import {createCare} from "./../../../../services/auth";

export default function PersonalData() {
  const [isLoading, setIsLoading] = useState(false); // NEW STATE
  const { BASE_URL } = useContext(AppContext);
  const { updateForm , formData } = useCareForm();
  const [profilePic, setprofilePic] = useState(formData.profilePic);
  const [username, setUsername] = useState(formData.username);
  const [gender, setGender] = useState(formData.gender);
  const [dateOfBirth, setdateOfBirth] = useState(formData.dateOfBirth);
  const [about, setabout] = useState(formData.about);
  const [skills, setskills] = useState(formData.skills);
  const router = useRouter();

  // const handlePictureUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       console.log(reader , 444444)
  //       setprofilePic(reader.result.slice(0, 12));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleNextClick = () => {
  //   if (
  //     username &&
  //     gender &&
  //     dateOfBirth &&
  //     about &&
  //     skills &&
  //     profilePic
  //   ) {
  //     router.push("/"); // Redirect to the home page
  //   } else {
  //     alert("Please fill all the fields and upload a profile picture.");
  //   }
  // };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (data.secure_url) {
        setprofilePic(data.secure_url); // Save the URL to state
        updateForm({ profilePic: data.secure_url });
      } else {
        alert("Upload failed");
        console.error("Error:", data);
      }
    } catch (err) {
      console.error("Cloudinary upload failed", err);
      alert("Image upload failed. Try again.");
    }
  };
  const handleBackClick = async () =>{
     updateForm({
      username: username,
      gender: gender,
      dateOfBirth: dateOfBirth,
      about: about,
      skills: skills,
      profilePic: profilePic,
    });
  }
  

  const handleNextClick = async () => {
    setIsLoading(true); // Start loader
    if (username && gender && dateOfBirth && about && skills && profilePic) {
      const updatedData = {
        ...formData,
        username,
        gender,
        dateOfBirth,
        about,
        skills,
        profilePic,
      };
      updateForm(updatedData); // Save to context
      
      try {
        console.log(updatedData , "updatedData")
        const data = await createCare(BASE_URL, updatedData);

        if (data.success) {
          router.push("/login");
        }
      }  catch (err) {
        alert("Something went wrong while submitting the form.");
        console.error(err);
      }finally {
        setIsLoading(false); // Stop loader
      }
    } else {
      setIsLoading(false); // Stop loader
      alert("Please fill all the fields and upload a profile picture.");
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20 pt-24 pb-10">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#ffffffcc] z-10">
          <div className="loader"></div> {/* Spinner */}
        </div>
      )}
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
                <div className="text-[11px]">Availability and details</div>
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
                htmlFor="profilePic"
                className="h-[140px] w-[140px] rounded-full border p-5 border-[#0000001A] flex flex-col gap-1 items-center justify-center cursor-pointer"
              >
                {profilePic ? (
                    <img
                      src={profilePic}
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
                id="profilePic"
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
                    value={dateOfBirth}
                    onChange={(e) => setdateOfBirth(e.target.value)}
                    className="w-full text-[12px] px-2 py-[6px] outline-none border border-[#0000001A] rounded-md"
                  />
                </div>
              </div>
              <div className="w-full flex gap-3">
                <div className="w-1/2">
                  <p className="text-[13px] font-[500] mb-1">About Yourself</p>
                  <textarea
                    value={about}
                    onChange={(e) => setabout(e.target.value)}
                    className="h-36 w-full text-[12px] px-3 py-[6px] outline-none border border-[#0000001A] rounded-md"
                  ></textarea>
                </div>
                <div className="w-1/2">
                  <p className="text-[13px] font-[500] mb-1">
                    About Your Skills
                  </p>
                  <textarea
                    value={skills}
                    onChange={(e) => setskills(e.target.value)}
                    className="h-36 w-full text-[12px] px-3 py-[6px] outline-none border border-[#0000001A] rounded-md"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8 gap-4">
              <button
                className="w-20 rounded-full px-[22px] py-[9px] text-[13px] bg-[#e3e3e3] text-[#000] cursor-pointer"
                onClick={() => {handleBackClick(); router.back()}}
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

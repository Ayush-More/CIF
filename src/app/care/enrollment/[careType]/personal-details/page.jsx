"use client";
import Navbar from "../../../../components/Navbar";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "../../../../context/AppContext";
import { useCareForm } from "../../../../context/CareFormContext";
import { createCare } from "../../../../services/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MIN_WORDS = 50;

export default function PersonalDetails() {
  const router = useRouter();
  const { BASE_URL } = useContext(AppContext);
  const { formData, updateForm } = useCareForm();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [username, setUsername] = useState(formData.username || "");
  const [gender, setGender] = useState(formData.gender || "");
  const [dateOfBirth, setdateOfBirth] = useState(formData.dateOfBirth || "");
  const [about, setabout] = useState(formData.about || "");
  const [skills, setskills] = useState(formData.skills || "");
  const [profilePic, setprofilePic] = useState(formData.profilePic || "");

  // Helper function to count words
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Helper function to calculate age
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Form validation
  const validateForm = () => {
    const errors = [];

    if (!username.trim()) {
      errors.push("Username is required");
    }

    if (!gender) {
      errors.push("Please select your gender");
    }

    if (!dateOfBirth) {
      errors.push("Date of birth is required");
    } else {
      const age = calculateAge(dateOfBirth);
      if (age < 18) {
        errors.push("You must be at least 18 years old to register");
      }
    }

    const aboutWords = countWords(about);
    if (!about || aboutWords < MIN_WORDS) {
      errors.push(`About yourself must contain at least ${MIN_WORDS} words (currently: ${aboutWords} words)`);
    }

    const skillsWords = countWords(skills);
    if (!skills || skillsWords < MIN_WORDS) {
      errors.push(`Skills description must contain at least ${MIN_WORDS} words (currently: ${skillsWords} words)`);
    }

    if (!profilePic) {
      errors.push("Profile picture is required");
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error(error, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
      return false;
    }

    return true;
  };

  // Calculate maximum date for 18 years ago
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('image/')) {
      toast.error('Please upload an image file', {
        position: "top-right",
        autoClose: 3000
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        setprofilePic(data.secure_url);
        updateForm({ profilePic: data.secure_url });
        toast.success('Profile picture uploaded successfully', {
          position: "top-right",
          autoClose: 2000
        });
      } else {
        toast.error('Upload failed', {
          position: "top-right",
          autoClose: 3000
        });
      }
    } catch (err) {
      toast.error('Image upload failed. Try again.', {
        position: "top-right",
        autoClose: 3000
      });
    }
  };

  const handleBackClick = async () => {
    updateForm({
      username,
      gender,
      dateOfBirth,
      about,
      skills,
      profilePic,
    });
    router.back();
  };

  const handleNextClick = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const updatedData = {
      ...formData,
      username,
      gender,
      dateOfBirth,
      about,
      skills,
      profilePic,
    };

    try {
      const data = await createCare(BASE_URL, updatedData);

      if (data.success) {
        toast.success('Form submitted successfully!', {
          position: "top-right",
          autoClose: 2000
        });
        router.push("/login");
      } else {
        toast.error(data.message || 'Failed to submit form', {
          position: "top-right",
          autoClose: 3000
        });
      }
    } catch (err) {
      toast.error('Something went wrong while submitting the form.', {
        position: "top-right",
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto md:px-10 lg:px-14 xl:px-20 pt-24 pb-10">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#ffffffcc] z-10">
            <div className="loader"></div>
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
                    <option value="" disabled>Select Gender</option>
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
                    max={maxDateString}
                    className="w-full text-[12px] px-2 py-[6px] outline-none border border-[#0000001A] rounded-md"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">You must be at least 18 years old</p>
                </div>
              </div>

              <div className="w-full flex gap-3">
                <div className="w-1/2 relative">
                  <p className="text-[13px] font-[500] mb-1">About Yourself</p>
                  <textarea
                    value={about}
                    onChange={(e) => setabout(e.target.value)}
                    className="h-36 w-full text-[12px] px-3 py-[6px] outline-none border border-[#0000001A] rounded-md"
                    placeholder={`Minimum ${MIN_WORDS} words required`}
                  ></textarea>
                  <div className="absolute bottom-2 right-2 text-[11px] text-gray-500">
                    {countWords(about)} words / {MIN_WORDS} required
                  </div>
                </div>

                <div className="w-1/2 relative">
                  <p className="text-[13px] font-[500] mb-1">About Your Skills</p>
                  <textarea
                    value={skills}
                    onChange={(e) => setskills(e.target.value)}
                    className="h-36 w-full text-[12px] px-3 py-[6px] outline-none border border-[#0000001A] rounded-md"
                    placeholder={`Minimum ${MIN_WORDS} words required`}
                  ></textarea>
                  <div className="absolute bottom-2 right-2 text-[11px] text-gray-500">
                    {countWords(skills)} words / {MIN_WORDS} required
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-4">
              <button
                className="w-20 rounded-full px-[22px] py-[9px] text-[13px] bg-[#e3e3e3] text-[#000] cursor-pointer"
                onClick={handleBackClick}
                disabled={isLoading}
              >
                Back
              </button>
              <button
                className="w-20 rounded-full px-[22px] py-[9px] text-[13px] bg-[#EF5744] text-[#ffffff] cursor-pointer"
                onClick={handleNextClick}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
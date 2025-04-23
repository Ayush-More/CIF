"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import Navbar from "./../../../components/Navbar";
import Footer from "./../../../components/Footer";
import Image from 'next/image';

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useParams(); // Changed from userId to user to match the route parameter
  const router = useRouter();
  const isOwnProfile = user === 'me' || user === profile?.user_id; // Updated to match your data structure

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/user/profile?userId=${user}`);
        const data = await response.json();
        if (data.success) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleCreateProfile = () => {
    router.push('/care/enrollment/care-type');
  };

  const handleEditProfile = () => {
    router.push(`/care/edit-profile/${profile.careProfile._id}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#EF5744]"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      <main className="container mx-auto px-4 mt-20 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                {profile?.careProfile?.profilePic ? (
                  <Image
                    src={profile.careProfile.profilePic}
                    alt={profile.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#EF5744] flex items-center justify-center text-white text-2xl">
                    {profile?.fullName?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{profile?.fullName}</h1>
                <p className="text-gray-600">{profile?.email}</p>
                {profile?.careProfile && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="bg-[#EF5744] text-white px-3 py-1 rounded-full text-sm">
                      {profile.careProfile.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <img src="/Icons/star.svg" alt="rating" className="h-4 w-4" />
                      <span className="text-sm text-gray-600">
                        {profile.careProfile.average_rating || 0} ({profile.careProfile.total_reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Action Buttons */}
            {isOwnProfile && (
              <div className="mt-4 md:mt-0">
                {profile?.careProfile ? (
                  <button
                    onClick={handleEditProfile}
                    className="bg-[#EF5744] text-white px-6 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-[#d94e3d] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleCreateProfile}
                    className="bg-[#EF5744] text-white px-6 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-[#d94e3d] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Care Profile
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Profile Content */}
          {profile?.careProfile ? (
            <CareProviderProfile profile={profile} isOwnProfile={isOwnProfile} />
          ) : (
            <UserBasicProfile profile={profile} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Component for care provider profile
function CareProviderProfile({ profile, isOwnProfile }) {
  const { careProfile } = profile;
  
  return (
    <div className="mt-6 space-y-6">
      {/* About Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
        <p className="text-gray-600">{careProfile.about || 'No description provided'}</p>
      </section>

      {/* Skills & Experience */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills & Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Skills</h3>
            <p className="text-gray-600">{careProfile.skills || 'No skills listed'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Experience</h3>
            <p className="text-gray-600">{careProfile.experience || 'No experience listed'}</p>
          </div>
        </div>
      </section>

      {/* Services Info */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Service Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Working Days</h3>
            <p className="text-gray-600">
              {careProfile.workingDays?.join(', ') || 'Not specified'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Timings</h3>
            <p className="text-gray-600">{careProfile.timings || 'Not specified'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Hourly Rate</h3>
            <p className="text-gray-600">₹{careProfile.hourlyRate || 'Not specified'}</p>
          </div>
        </div>
      </section>

      {/* Contact Button - Only show for other users viewing the profile */}
      {!isOwnProfile && (
        <div className="mt-8">
          <button className="bg-[#EF5744] text-white px-6 py-3 rounded-full w-full md:w-auto flex items-center justify-center gap-2 hover:bg-[#d94e3d] transition-colors">
            <img src="/Icons/phone.svg" alt="" className="h-4 w-4" />
            Contact Now
          </button>
        </div>
      )}
    </div>
  );
}

// Component for basic user profile
function UserBasicProfile({ profile }) {
  return (
    <div className="mt-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">Full Name</h3>
            <p className="text-gray-600">{profile?.fullName}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Email</h3>
            <p className="text-gray-600">{profile?.email}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Member Since</h3>
            <p className="text-gray-600">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
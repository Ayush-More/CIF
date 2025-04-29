"use client";
import React from 'react';
import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ProfileDialog = ({ isOpen, closeDialog, profileData, isLoading }) => {
    // Show loading state
    const router = useRouter();
    const [showFullAbout, setShowFullAbout] = useState(false);
    if (isLoading) {
        return (
            <Dialog as="div" className="relative z-50" open={isOpen} onClose={closeDialog}>
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#EF5744] border-t-transparent"></div>
                    </div>
                </div>
            </Dialog>
        );
    }

    // Show error state if profileData is null
    if (!profileData) {
        return (
            <Dialog as="div" className="relative z-50" open={isOpen} onClose={closeDialog}>
                <div className="fixed inset-0 backdrop-blur-sm bg-white/30">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No profile data available</h3>
                                <p className="mt-1 text-sm text-gray-500">Unable to load profile information.</p>
                                <div className="mt-6">
                                    <button
                                        onClick={closeDialog}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-[#EF5744] hover:bg-[#ef5744dd] transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }

    // Destructure profileData only after confirming it exists
    const {
        username = "Anonymous User",
        profilePic = "https://cdn-icons-png.flaticon.com/512/1808/1808546.png",
        location = "Mumbai",
        category = "Child Care",
        total_reviews = 0,
        average_rating = 5,
        about = "",
        isOnline = false,
        user_id = "",
    } = profileData;
    const truncateText = (text, wordCount = 20) => {
        const words = text.split(' ');
        if (words.length > wordCount) {
            return {
                truncated: words.slice(0, wordCount).join(' '),
                hasMore: true
            };
        }
        return {
            truncated: text,
            hasMore: false
        };
    };

    const aboutText = truncateText(about || "No description available");

    // Handle view profile click
    const handleViewProfile = () => {
        closeDialog();
        router.push(`/profile/${user_id}`);
    };
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeDialog}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 backdrop-blur-sm bg-white/30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {/* Close Button */}
                                <div className="absolute right-4 top-4">
                                    <button
                                        onClick={closeDialog}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Profile Header */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative">
                                        <img
                                            src={profilePic}
                                            alt={username}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-[#EF5744]"
                                        />
                                        {isOnline && (
                                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                                        )}
                                    </div>
                                    <h2 className="mt-4 text-2xl font-semibold text-gray-800">{username}</h2>
                                    <p className="text-[#EF5744] font-medium">{category}</p>
                                </div>

                                {/* Profile Details */}
                                <div className="space-y-6">
                                    {/* Location */}
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#EF5744]/10 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#EF5744]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-medium text-gray-800">{location}</p>
                                        </div>
                                    </div>

                                    {/* Rating & Reviews */}
                                    <div className="flex space-x-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#EF5744]/10 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-[#EF5744]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Rating</p>
                                                <p className="font-medium text-gray-800">{average_rating.toFixed(1)}/5.0</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#EF5744]/10 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-[#EF5744]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Reviews</p>
                                                <p className="font-medium text-gray-800">{total_reviews}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* About Section */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
                                    <div className="text-gray-600 text-sm leading-relaxed">
                                        {showFullAbout ? (
                                            <p>{about || "No description available"}</p>
                                        ) : (
                                            <p>
                                                {aboutText.truncated}
                                                {aboutText.hasMore && (
                                                    <button
                                                        onClick={() => setShowFullAbout(true)}
                                                        className="ml-2 text-[#EF5744] hover:text-[#ef5744dd] font-medium focus:outline-none"
                                                    >
                                                        Read more
                                                    </button>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                    {/* Actions */}
                                    <div className="flex space-x-3">
                                        <button  onClick={() => {
                                            closeDialog();
                                            // Any additional message action
                                        }} className="flex-1 px-4 py-2 bg-[#EF5744] text-white rounded-xl hover:bg-[#ef5744dd] transition-colors duration-200 font-medium">
                                            Message
                                        </button>
                                        <button onClick={handleViewProfile} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ProfileDialog;
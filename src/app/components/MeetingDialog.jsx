"use client";
import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

const timeZones = [
    "Asia/Kolkata",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Australia/Sydney",
    // Add more time zones as needed
];

const MeetingDialog = ({ isOpen, closeDialog, onMeetingCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [timezone, setTimezone] = useState('Asia/Kolkata');
    const [loading, setLoading] = useState(false);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
        
    //     if (!title || !description || !date || !timezone) {
    //         toast.error('Please fill in all fields');
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const response = await fetch('/api/chat/create-meeting', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 title,
    //                 description,
    //                 date: date.toISOString().split('T')[0],
    //                 time: date.toTimeString().split(' ')[0].slice(0, 5),
    //                 timezone
    //             }),
    //         });

    //         const data = await response.json();
    //         if (data.success) {
    //             toast.success('Meeting created successfully');
    //             // Pass meeting data to parent component
    //             onMeetingCreated({
    //                 title,
    //                 scheduledDate: date,
    //                 joinUrl: data.data.join_url,
    //                 timezone
    //             });
    //             closeDialog();
    //         } else {
    //             throw new Error(data.message);
    //         }
    //     } catch (error) {
    //         toast.error(error.message || 'Failed to create meeting');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !date || !timezone) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/chat/create-meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    date: date.toISOString().split('T')[0],
                    time: date.toTimeString().split(' ')[0].slice(0, 5),
                    timezone
                }),
            });

            const data = await response.json();
            if (data.success) {
                // Pass meeting data to chat component
                onMeetingCreated({
                    title,
                    scheduledDate: date.toISOString(),
                    joinUrl: data.data.join_url,
                    timezone
                });
                
                toast.success('Meeting created successfully');
                closeDialog();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create meeting');
        } finally {
            setLoading(false);
        }
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
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl font-semibold text-gray-800 mb-4"
                                >
                                    Meeting Parameters
                                </Dialog.Title>
                                <p className="text-sm text-gray-500 mb-6">
                                    Click on the button below to create a meeting link
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Meeting Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Meeting Title
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF5744] transition-colors"
                                            placeholder="Enter meeting title"
                                        />
                                    </div>

                                    {/* Meeting Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Meeting Description
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF5744] transition-colors"
                                            placeholder="Enter meeting description"
                                            rows={3}
                                        />
                                    </div>

                                    {/* Date and Time Picker */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Select Meeting Date & Time
                                        </label>
                                        <DatePicker
                                            selected={date}
                                            onChange={(date) => setDate(date)}
                                            showTimeSelect
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            minDate={new Date()}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF5744] transition-colors"
                                        />
                                    </div>

                                    {/* Timezone Selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Select TimeZone
                                        </label>
                                        <select
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EF5744] transition-colors"
                                        >
                                            {timeZones.map((tz) => (
                                                <option key={tz} value={tz}>
                                                    {tz}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={closeDialog}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-4 py-2 text-sm font-medium text-white bg-[#EF5744] rounded-xl hover:bg-[#ef5744dd] transition-colors disabled:opacity-50"
                                        >
                                            {loading ? 'Creating...' : 'Create Meeting'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default MeetingDialog;
const MeetingMessage = ({ meeting, isUserMessage }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getTimeFromNow = (date) => {
        const now = new Date();
        const meetingDate = new Date(date);
        const diffInDays = Math.floor((meetingDate - now) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Tomorrow";
        if (diffInDays > 1 && diffInDays < 7) return `In ${diffInDays} days`;
        return formatDate(date).split(',')[0]; // Return just the date part
    };

    return (
        <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} p-2`}>
            <div className="max-w-[320px] bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                {/* Meeting Header */}
                <div className="bg-gradient-to-r from-[#EF5744] to-[#ff7563] px-4 py-3 text-white">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <h3 className="font-semibold truncate">{meeting.title}</h3>
                    </div>
                </div>

                <div className="p-4">
                    {/* Meeting Time */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-[#EF5744]/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#EF5744]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Scheduled for</p>
                                <p className="text-sm font-medium text-gray-800">
                                    {getTimeFromNow(meeting.scheduledDate)}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">{meeting.timezone}</p>
                            <p className="text-sm font-medium text-gray-800">
                                {new Date(meeting.scheduledDate).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Join Button */}
                    <a 
                        href={meeting.joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative w-full bg-[#EF5744] text-white text-center py-2.5 rounded-xl hover:bg-[#ef5744dd] transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                        <svg 
                            className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Join Meeting</span>
                    </a>

                    {/* Message Info */}
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                        <span>Created by {isUserMessage ? 'You' : 'Care Provider'}</span>
                        <span>{new Date().toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                        })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingMessage;
import React from 'react';
import { Bookmark, MapPin, Briefcase, Clock, IndianRupee, Building } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - createdAt.getTime();
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "1 day ago";
        return `${days} days ago`;
    }

    const handleNavigate = () => {
        navigate(`/description/${job?._id}`);
    }

    // Function to get company initials for the fallback avatar
    const getCompanyInitials = (name) => {
        if (!name) return "CO";
        return name.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div 
            onClick={handleNavigate}
            className='p-4 sm:p-5 lg:p-6 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-xl hover:border-indigo-500 transition-all duration-300 cursor-pointer'
        >
            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4'>
                <div className='flex items-center gap-3 sm:gap-4'>
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16 bg-[#6A38C2] text-white flex-shrink-0">
                        <AvatarImage 
                            src={job?.company?.logo || "https://via.placeholder.com/100?text=" + encodeURIComponent(getCompanyInitials(job?.company?.name))} 
                            alt={job?.company?.name} 
                        />
                        <AvatarFallback className="bg-[#6A38C2] text-white text-sm sm:text-lg font-semibold">
                            {getCompanyInitials(job?.company?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                        <h2 className='text-lg sm:text-xl font-bold text-gray-900 truncate'>{job?.title}</h2>
                        <p className='text-sm sm:text-md text-gray-600 truncate'>{job?.company?.name}</p>
                    </div>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation when clicking the bookmark
                        // Add bookmark logic here
                    }}
                    className="p-2 text-gray-400 hover:text-[#6A38C2] transition-colors self-start sm:self-auto"
                >
                    <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
            </div>

            <div className='my-3 sm:my-4'>
                <p className='text-xs sm:text-sm text-gray-700 leading-relaxed'>
                    {job?.description.length > 150 ? `${job?.description.substring(0, 150)}...` : job?.description}
                </p>
            </div>

            <div className='flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600'>
                <div className='flex items-center gap-1 sm:gap-2'>
                    <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{job?.jobType}</span>
                </div>
                <div className='flex items-center gap-1 sm:gap-2'>
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{job?.location || "India"}</span>
                </div>
                <div className='flex items-center gap-1 sm:gap-2'>
                    <IndianRupee className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{job?.salary} LPA</span>
                </div>
            </div>

            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4'>
                <div>
                    <Badge variant="outline" className="border-green-500 text-green-600 text-xs sm:text-sm">{job?.position} Positions</Badge>
                </div>
                <p className='text-xs sm:text-sm text-gray-500 flex items-center gap-1 sm:gap-2'>
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    {daysAgoFunction(job?.createdAt)}
                </p>
            </div>
        </div>
    );
}

export default Job;
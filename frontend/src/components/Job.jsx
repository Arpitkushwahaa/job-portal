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
            className='p-6 rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-xl hover:border-indigo-500 transition-all duration-300 cursor-pointer'
        >
            <div className='flex items-start justify-between'>
                <div className='flex items-center gap-4'>
                    <Avatar className="h-16 w-16 bg-[#6A38C2] text-white">
                        <AvatarImage 
                            src={job?.company?.logo || "https://via.placeholder.com/100?text=" + encodeURIComponent(getCompanyInitials(job?.company?.name))} 
                            alt={job?.company?.name} 
                        />
                        <AvatarFallback className="bg-[#6A38C2] text-white text-lg font-semibold">
                            {getCompanyInitials(job?.company?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className='text-xl font-bold text-gray-900'>{job?.title}</h2>
                        <p className='text-md text-gray-600'>{job?.company?.name}</p>
                    </div>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation when clicking the bookmark
                        // Add bookmark logic here
                    }}
                    className="p-2 text-gray-400 hover:text-[#6A38C2] transition-colors"
                >
                    <Bookmark />
                </button>
            </div>

            <div className='my-4'>
                <p className='text-sm text-gray-700 leading-relaxed'>
                    {job?.description.length > 150 ? `${job?.description.substring(0, 150)}...` : job?.description}
                </p>
            </div>

            <div className='flex items-center gap-4 flex-wrap text-sm text-gray-600'>
                <div className='flex items-center gap-2'>
                    <Briefcase size={16} />
                    <span>{job?.jobType}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <MapPin size={16} />
                    <span>{job?.location || "India"}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <IndianRupee size={16} />
                    <span>{job?.salary} LPA</span>
                </div>
            </div>

            <div className='flex items-center justify-between mt-4'>
                <div>
                    <Badge variant="outline" className="border-green-500 text-green-600">{job?.position} Positions</Badge>
                </div>
                <p className='text-sm text-gray-500 flex items-center gap-2'>
                    <Clock size={14} />
                    {daysAgoFunction(job?.createdAt)}
                </p>
            </div>
        </div>
    );
}

export default Job;
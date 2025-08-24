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
            className='group p-5 rounded-xl shadow-sm bg-white border border-gray-200 hover:shadow-lg hover:border-[#6A38C2]/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-gray-50/50'
        >
            {/* Header with Company Info and Bookmark */}
            <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                    <Avatar className="h-12 w-12 bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] text-white flex-shrink-0 shadow-sm">
                        <AvatarImage 
                            src={job?.company?.logo || "https://via.placeholder.com/100?text=" + encodeURIComponent(getCompanyInitials(job?.company?.name))} 
                            alt={job?.company?.name} 
                        />
                        <AvatarFallback className="bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] text-white text-sm font-semibold">
                            {getCompanyInitials(job?.company?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                        <h2 className='text-lg font-bold text-gray-900 truncate group-hover:text-[#6A38C2] transition-colors'>
                            {job?.title}
                        </h2>
                        <p className='text-sm text-gray-600 truncate flex items-center gap-1'>
                            <Building className='h-3 w-3' />
                            {job?.company?.name}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add bookmark logic here
                    }}
                    className="p-2 text-gray-400 hover:text-[#6A38C2] hover:bg-[#6A38C2]/10 rounded-lg transition-all duration-200 self-start"
                >
                    <Bookmark className="h-4 w-4" />
                </button>
            </div>

            {/* Job Description */}
            <div className='mb-4'>
                <p className='text-sm text-gray-700 leading-relaxed line-clamp-3'>
                    {job?.description.length > 120 ? `${job?.description.substring(0, 120)}...` : job?.description}
                </p>
            </div>

            {/* Job Details */}
            <div className='grid grid-cols-2 gap-3 mb-4'>
                <div className='flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg'>
                    <Briefcase className="h-3 w-3 text-[#6A38C2]" />
                    <span className='truncate'>{job?.jobType}</span>
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg'>
                    <MapPin className="h-3 w-3 text-[#6A38C2]" />
                    <span className='truncate'>{job?.location || "India"}</span>
                </div>
            </div>

            {/* Salary and Additional Info */}
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded-lg'>
                    <IndianRupee className="h-4 w-4" />
                    <span>{job?.salary} LPA</span>
                </div>
                <Badge variant="outline" className="border-[#6A38C2] text-[#6A38C2] bg-[#6A38C2]/5 text-xs">
                    {job?.position} Position{job?.position > 1 ? 's' : ''}
                </Badge>
            </div>

            {/* Footer with Time */}
            <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
                <p className='text-xs text-gray-500 flex items-center gap-1'>
                    <Clock className="h-3 w-3" />
                    {daysAgoFunction(job?.createdAt)}
                </p>
                <div className='text-xs text-[#6A38C2] font-medium group-hover:translate-x-1 transition-transform'>
                    View Details →
                </div>
            </div>
        </div>
    );
}

export default Job;
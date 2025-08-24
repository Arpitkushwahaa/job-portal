import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    
    // Function to get company initials for the fallback avatar
    const getCompanyInitials = (name) => {
        if (!name) return "CO";
        return name.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div 
            onClick={()=> navigate(`/description/${job._id}`)} 
            className='group relative p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg bg-white border border-gray-200 cursor-pointer transition-all duration-300 ease-out hover:shadow-2xl hover:scale-105 hover:-translate-y-1 overflow-hidden'
        >
            {/* Content container */}
            <div className='relative z-10'>
                {/* Company Logo and Name Section */}
                <div className='flex items-center gap-3 mb-3 sm:mb-4 p-2 rounded-lg bg-gray-50/50 group-hover:bg-gray-100/50 transition-colors duration-300'>
                    <Avatar className="h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] text-white flex-shrink-0 shadow-md ring-2 ring-white">
                        <AvatarImage 
                            src={job?.company?.logo || "https://via.placeholder.com/100?text=" + encodeURIComponent(getCompanyInitials(job?.company?.name))} 
                            alt={job?.company?.name} 
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] text-white text-sm sm:text-base font-bold">
                            {getCompanyInitials(job?.company?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                        <h1 className='font-bold text-base sm:text-lg text-gray-800 mb-1 truncate group-hover:text-[#6A38C2] transition-colors'>
                            {job?.company?.name}
                        </h1>
                        <p className='text-xs sm:text-sm text-gray-500 flex items-center gap-1'>
                            <svg className='w-3 h-3 text-[#6A38C2]' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                            </svg>
                            <span className='truncate'>{job?.location || 'India'}</span>
                        </p>
                    </div>
                </div>
                
                <div className='transition-all duration-300 group-hover:transform group-hover:scale-105 my-3 sm:my-4'>
                    <h1 className='font-bold text-lg sm:text-xl text-gray-900 mb-2'>{job?.title}</h1>
                    <p className='text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2'>
                        {job?.description?.length > 120 ? `${job?.description?.substring(0, 120)}...` : job?.description}
                    </p>
                </div>
                
                <div className='flex flex-wrap items-center gap-2 mt-4 sm:mt-6 transition-all duration-300 group-hover:transform group-hover:scale-105'>
                    <Badge className={'text-blue-700 font-semibold border text-xs sm:text-sm'} variant="ghost">
                        {job?.position} Positions
                    </Badge>
                    <Badge className={'text-[#F83002] font-semibold border text-xs sm:text-sm'} variant="ghost">
                        {job?.jobType}
                    </Badge>
                    <Badge className={'text-[#7209b7] font-semibold border text-xs sm:text-sm'} variant="ghost">
                        {job?.salary}LPA
                    </Badge>
                </div>
            </div>
        </div>
    )
}

export default LatestJobCards
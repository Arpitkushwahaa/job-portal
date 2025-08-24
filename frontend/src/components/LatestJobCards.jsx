import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div 
            onClick={()=> navigate(`/description/${job._id}`)} 
            className='group relative p-4 sm:p-5 lg:p-6 rounded-xl shadow-lg bg-white border border-gray-200 cursor-pointer transition-all duration-300 ease-out hover:shadow-2xl hover:scale-105 hover:-translate-y-1 overflow-hidden'
        >
            {/* Content container */}
            <div className='relative z-10'>
                <div className='transition-all duration-300 group-hover:transform group-hover:scale-105'>
                    <h1 className='font-semibold text-base sm:text-lg text-gray-800 mb-1'>{job?.company?.name}</h1>
                    <p className='text-xs sm:text-sm text-gray-500 flex items-center gap-1'>
                        <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                        </svg>
                        India
                    </p>
                </div>
                
                <div className='transition-all duration-300 group-hover:transform group-hover:scale-105 my-3 sm:my-4'>
                    <h1 className='font-bold text-lg sm:text-xl text-gray-900 mb-2'>{job?.title}</h1>
                    <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>
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
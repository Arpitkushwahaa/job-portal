import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const LatestJobs = () => {
    const { allJobs, loading } = useSelector(store => store.job);
    const navigate = useNavigate();

    const viewAllJobs = () => {
        navigate('/jobs');
    }

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className='col-span-full md:col-span-2 lg:col-span-3'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {[...Array(6)].map((_, index) => (
                    <div key={index} className='animate-pulse'>
                        <div className='p-6 rounded-xl bg-gray-200 border border-gray-300'>
                            <div className='h-6 bg-gray-300 rounded mb-2'></div>
                            <div className='h-4 bg-gray-300 rounded w-3/4 mb-4'></div>
                            <div className='h-8 bg-gray-300 rounded mb-2'></div>
                            <div className='h-4 bg-gray-300 rounded mb-4'></div>
                            <div className='flex gap-2'>
                                <div className='h-6 bg-gray-300 rounded w-20'></div>
                                <div className='h-6 bg-gray-300 rounded w-24'></div>
                                <div className='h-6 bg-gray-300 rounded w-16'></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className='bg-white py-12 sm:py-16 lg:py-20'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center mb-12 sm:mb-16'>
                    <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 animate-fade-in'>
                        <span className='text-[#6A38C2]'>Latest & Top</span> Job Openings
                    </h1>
                    <p className='text-gray-600 mt-4 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-200 px-4'>
                        Discover the most recent job opportunities from top companies. Your next career is just a click away.
                    </p>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16'>
                    {loading ? (
                        <LoadingSkeleton />
                    ) : allJobs.length <= 0 ? (
                        <div className='col-span-full text-center py-8 sm:py-12 animate-fade-in'>
                            <div className='inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-4'>
                                <svg className='w-6 h-6 sm:w-8 sm:h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6' />
                                </svg>
                            </div>
                            <p className='text-gray-600 text-base sm:text-lg'>No jobs available at the moment.</p>
                            <p className='text-gray-500 text-sm mt-2'>Check back later for new opportunities!</p>
                        </div>
                    ) : (
                        allJobs?.slice(0, 6).map((job, index) => (
                            <div 
                                key={job._id} 
                                className='relative animate-fade-in-up'
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <LatestJobCards job={job} />
                            </div>
                        ))
                    )}
                </div>
                <div className='text-center animate-fade-in animation-delay-600'>
                    <Button 
                        onClick={viewAllJobs} 
                        className='bg-[#6A38C2] hover:bg-[#5b30a6] text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#6A38C2]/25'
                    >
                        View All Jobs
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LatestJobs;
import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Button } from './ui/button';

const Browse = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const dispatch = useDispatch();

    useEffect(() => {
        // Cleanup function to clear search query on component unmount
        return () => {
            dispatch(setSearchedQuery(""));
        };
    }, [dispatch]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className='max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8'>
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    
                    {/* Left Column: Search Results Header */}
                    <div className="w-full lg:w-1/4 order-2 lg:order-1">
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
                            <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
                                Search Results <span className="text-gray-600">({allJobs.length})</span>
                            </h1>
                            {searchedQuery && <p className="text-gray-600 mt-1 text-sm sm:text-base">Showing results for: <span className="font-semibold">"{searchedQuery}"</span></p>}
                        </div>
                    </div>

                    {/* Right Column: Job Listings */}
                    <div className="w-full lg:w-3/4 order-1 lg:order-2">
                        {allJobs.length > 0 ? (
                            <div className='grid grid-cols-1 gap-4 sm:gap-6'>
                                {
                                    allJobs.map((job) => (
                                        <Job key={job._id} job={job} />
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-12">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">No Jobs Found</h2>
                                <p className="text-gray-600 mt-2 text-sm sm:text-base">We couldn't find any jobs matching your search. Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Browse;
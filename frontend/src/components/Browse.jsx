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
            <div className='max-w-7xl mx-auto py-12 px-6'>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column: Filters */}
                    <div className="w-full md:w-1/4">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Filters</h3>
                            {/* Placeholder for filter controls */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Job Type</label>
                                    <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Location</label>
                                    <input type="text" placeholder="e.g., New York" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">Apply Filters</Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Job Listings */}
                    <div className="w-full md:w-3/4">
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h1 className='text-2xl font-bold text-gray-900'>
                                Search Results <span className="text-gray-600">({allJobs.length})</span>
                            </h1>
                            {searchedQuery && <p className="text-gray-600 mt-1">Showing results for: <span className="font-semibold">"{searchedQuery}"</span></p>}
                        </div>

                        {allJobs.length > 0 ? (
                            <div className='grid grid-cols-1 gap-6'>
                                {
                                    allJobs.map((job) => (
                                        <Job key={job._id} job={job} />
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <h2 className="text-2xl font-bold text-gray-800">No Jobs Found</h2>
                                <p className="text-gray-600 mt-2">We couldn't find any jobs matching your search. Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Browse;
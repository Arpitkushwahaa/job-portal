import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    // Loading skeleton component
    const JobSkeleton = () => (
        <div className="p-5 rounded-xl bg-white border border-gray-200 animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                </div>
                <div className="h-8 w-8 bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                <div className="h-3 bg-gray-300 rounded w-4/6"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
            </div>
            <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-300 rounded w-20"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Available Jobs
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-gray-600">
                                {!isLoading && filterJobs.length > 0 
                                    ? `Found ${filterJobs.length} job${filterJobs.length === 1 ? '' : 's'}`
                                    : isLoading 
                                        ? 'Loading jobs...'
                                        : 'No jobs found'
                                }
                            </p>
                        </div>
                        {searchedQuery && !isLoading && (
                            <div className="mt-4 sm:mt-0">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    Filter: {searchedQuery}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    
                    {/* Filter Card - Sticky on desktop */}
                    <div className="w-full lg:w-80 order-2 lg:order-1">
                        <div className="lg:sticky lg:top-24">
                            <FilterCard />
                        </div>
                    </div>
                    
                    {/* Jobs Grid */}
                    <div className="flex-1 order-1 lg:order-2">
                        {isLoading ? (
                            // Loading state
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {[...Array(6)].map((_, index) => (
                                    <JobSkeleton key={index} />
                                ))}
                            </div>
                        ) : filterJobs.length === 0 ? (
                            // Empty state
                            <div className="text-center py-12">
                                <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                                <p className="text-gray-500">
                                    {searchedQuery 
                                        ? `No jobs match "${searchedQuery}". Try adjusting your search.`
                                        : "No jobs are currently available. Please check back later."
                                    }
                                </p>
                            </div>
                        ) : (
                            // Jobs grid
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {filterJobs.map((job, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ 
                                            duration: 0.4, 
                                            delay: index * 0.1,
                                            ease: "easeOut"
                                        }}
                                        key={job?._id}
                                        className="w-full"
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs
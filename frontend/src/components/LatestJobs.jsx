import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const navigate = useNavigate();

    const viewAllJobs = () => {
        navigate('/jobs');
    }

    return (
        <div className='bg-white py-20'>
            <div className='max-w-7xl mx-auto px-6'>
                <div className='text-center mb-12'>
                    <h1 className='text-4xl md:text-5xl font-extrabold text-gray-900'>
                        <span className='text-[#6A38C2]'>Latest & Top</span> Job Openings
                    </h1>
                    <p className='text-gray-600 mt-4 text-lg'>
                        Discover the most recent job opportunities from top companies. Your next career is just a click away.
                    </p>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {
                        allJobs.length <= 0 ? (
                            <p className='text-center col-span-full text-gray-600'>No jobs available at the moment.</p>
                        ) : (
                            allJobs?.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)
                        )
                    }
                </div>
                <div className='text-center mt-12'>
                    <Button onClick={viewAllJobs} className='bg-[#6A38C2] hover:bg-[#5b30a6] text-white font-bold py-3 px-8 rounded-full text-lg'>
                        View All Jobs
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LatestJobs;
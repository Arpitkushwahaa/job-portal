import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    {/* Left Column */}
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <span className='px-4 py-2 rounded-full bg-gray-200 text-[#F83002] font-medium'>No. 1 Job Hunt Website</span>
                        <h1 className='text-5xl md:text-6xl font-extrabold text-gray-900 mt-4 leading-tight'>
                            Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Job</span>
                        </h1>
                        <p className="text-gray-600 mt-6 text-lg">
                            Discover thousands of job opportunities, from entry-level to executive roles. Your next career move starts here.
                        </p>
                        <div className='flex w-full md:w-3/4 mt-8 shadow-lg border border-gray-200 pl-4 pr-2 py-2 rounded-full items-center bg-white'>
                            <input
                                type="text"
                                placeholder='Job title, keywords, or company'
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className='outline-none border-none w-full bg-transparent text-gray-700'
                            />
                            <Button onClick={searchJobHandler} className="rounded-full bg-[#6A38C2] hover:bg-[#5b30a6] px-6 py-3">
                                <Search className='h-6 w-6' />
                            </Button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="md:w-1/2 flex justify-center">
                        <img 
                            src="https://img.freepik.com/free-vector/man-having-online-job-interview_52683-43379.jpg?w=996&t=st=1709893303~exp=1709893903~hmac=c6910114e942a4a39553c7c75662f39f6079a4d318de231ea014f04c14b8a24b"
                            alt="Job Interview Illustration"
                            className="rounded-lg shadow-2xl w-full max-w-md"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;
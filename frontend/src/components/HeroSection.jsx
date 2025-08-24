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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                    {/* Left Column */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <span className='inline-block px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-gray-200 text-[#F83002] font-medium text-sm sm:text-base'>No. 1 Job Hunt Website</span>
                        <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mt-4 sm:mt-6 leading-tight'>
                            Search, Apply & <br className="hidden sm:block" /> Get Your <span className='text-[#6A38C2]'>Dream Job</span>
                        </h1>
                        <p className="text-gray-600 mt-4 sm:mt-6 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                            Discover thousands of job opportunities, from entry-level to executive roles. Your next career move starts here.
                        </p>
                        <div className='flex w-full max-w-md mx-auto lg:mx-0 mt-6 sm:mt-8 shadow-lg border border-gray-200 pl-3 sm:pl-4 pr-2 py-2 rounded-full items-center bg-white'>
                            <input
                                type="text"
                                placeholder='Job title, keywords, or company'
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className='outline-none border-none w-full bg-transparent text-gray-700 text-sm sm:text-base'
                            />
                            <Button onClick={searchJobHandler} className="rounded-full bg-[#6A38C2] hover:bg-[#5b30a6] px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                                <Search className='h-4 w-4 sm:h-6 sm:w-6' />
                            </Button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <img 
                            src="https://img.freepik.com/free-vector/man-having-online-job-interview_52683-43379.jpg?w=996&t=st=1709893303~exp=1709893903~hmac=c6910114e942a4a39553c7c75662f39f6079a4d318de231ea014f04c14b8a24b"
                            alt="Job Interview Illustration"
                            className="rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeroSection;
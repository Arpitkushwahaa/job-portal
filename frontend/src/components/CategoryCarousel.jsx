import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { FaCode, FaServer, FaDatabase, FaPaintBrush, FaLaptopCode } from 'react-icons/fa';

const categories = [
    { name: "Frontend Developer", icon: <FaCode size={40} className="text-[#6A38C2] group-hover:text-white" /> },
    { name: "Backend Developer", icon: <FaServer size={40} className="text-[#6A38C2] group-hover:text-white" /> },
    { name: "Data Science", icon: <FaDatabase size={40} className="text-[#6A38C2] group-hover:text-white" /> },
    { name: "Graphic Designer", icon: <FaPaintBrush size={40} className="text-[#6A38C2] group-hover:text-white" /> },
    { name: "FullStack Developer", icon: <FaLaptopCode size={40} className="text-[#6A38C2] group-hover:text-white" /> }
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='bg-white py-12 sm:py-16 lg:py-20'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='text-center mb-8 sm:mb-12'>
                    <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4'>
                        <span className='text-[#6A38C2]'>Popular</span> Job Categories
                    </h1>
                    <p className='text-gray-600 text-base sm:text-lg max-w-2xl mx-auto'>
                        Explore job opportunities across various industries and find your perfect match
                    </p>
                </div>
                <Carousel className="w-full">
                    <CarouselContent className="-ml-2 sm:-ml-4">
                        {
                            categories.map((category, index) => (
                                <CarouselItem key={index} className="pl-2 sm:pl-4 md:basis-1/2 lg:basis-1/3">
                                    <div 
                                        onClick={() => searchJobHandler(category.name)} 
                                        className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center text-center group hover:bg-[#6A38C2] hover:scale-105"
                                    >
                                        <div className='w-12 h-12 sm:w-16 sm:h-16 text-[#6A38C2] group-hover:text-white transition-colors duration-300'>
                                            {category.icon}
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-3 sm:mt-4 group-hover:text-white transition-colors duration-300">{category.name}</h3>
                                    </div>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg" />
                    <CarouselNext className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg" />
                </Carousel>
            </div>
        </div>
    );
}

export default CategoryCarousel;
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
        <div className='bg-gray-50 py-20'>
            <div className='max-w-7xl mx-auto px-6'>
                <div className='text-center mb-12'>
                    <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900'>
                        Explore by <span className='text-[#6A38C2]'>Category</span>
                    </h2>
                    <p className='text-gray-600 mt-4 text-lg'>
                        Find jobs in your favorite categories. We have a wide range of opportunities available.
                    </p>
                </div>
                <Carousel className="w-full">
                    <CarouselContent className="-ml-4">
                        {
                            categories.map((category, index) => (
                                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <div 
                                        onClick={() => searchJobHandler(category.name)} 
                                        className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer flex flex-col items-center text-center group hover:bg-[#6A38C2] hover:scale-105"
                                    >
                                        {category.icon}
                                        <h3 className="text-xl font-semibold text-gray-800 mt-4 group-hover:text-white">{category.name}</h3>
                                    </div>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg" />
                    <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg" />
                </Carousel>
            </div>
        </div>
    );
}

export default CategoryCarousel;
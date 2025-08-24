import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Filter, X } from 'lucide-react'

const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        fitlerType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();
    
    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    
    const clearFilter = () => {
        setSelectedValue('');
        dispatch(setSearchedQuery(''));
    }
    
    useEffect(()=>{
        dispatch(setSearchedQuery(selectedValue));
    },[selectedValue, dispatch]);
    
    return (
        <div className='w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
            {/* Header */}
            <div className='bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] px-4 py-3'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Filter className='h-5 w-5 text-white' />
                        <h2 className='font-semibold text-white text-lg'>Filters</h2>
                    </div>
                    {selectedValue && (
                        <button
                            onClick={clearFilter}
                            className='p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors'
                            title="Clear filters"
                        >
                            <X className='h-4 w-4 text-white' />
                        </button>
                    )}
                </div>
            </div>
            
            {/* Filter Content */}
            <div className='p-4'>
                <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                    {fitlerData.map((data, index) => (
                        <div key={`filter-${index}`} className='mb-6 last:mb-0'>
                            <h3 className='font-semibold text-gray-900 text-base mb-3 flex items-center gap-2'>
                                <div className='w-2 h-2 bg-[#6A38C2] rounded-full'></div>
                                {data.fitlerType}
                            </h3>
                            <div className='space-y-2'>
                                {data.array.map((item, idx) => {
                                    const itemId = `id${index}-${idx}`
                                    return (
                                        <div key={`item-${index}-${idx}`} className='flex items-center space-x-3'>
                                            <RadioGroupItem 
                                                value={item} 
                                                id={itemId}
                                                className='text-[#6A38C2] border-gray-300 hover:border-[#6A38C2]'
                                            />
                                            <Label 
                                                htmlFor={itemId} 
                                                className='text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors'
                                            >
                                                {item}
                                            </Label>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </RadioGroup>
                
                {/* Active Filter Display */}
                {selectedValue && (
                    <div className='mt-4 pt-4 border-t border-gray-200'>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>Active filter:</span>
                            <span className='text-sm font-medium text-[#6A38C2]'>{selectedValue}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FilterCard
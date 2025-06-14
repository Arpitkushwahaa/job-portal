import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Avatar, AvatarImage } from './ui/avatar';
import { MapPin, Briefcase, Clock, IndianRupee, GraduationCap, Users } from 'lucide-react';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSingleJob = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    // Check if the current user has applied
                    const hasApplied = res.data.job.applications.some(application => application.applicant === user?._id);
                    setIsApplied(hasApplied);
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch job details.");
            } finally {
                setLoading(false);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setIsApplied(true);
                // Optimistically update the UI
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl font-semibold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            <Navbar />
            <div className='max-w-7xl mx-auto my-12 px-6'>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Column: Job Details */}
                    <div className="w-full md:w-2/3">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} />
                                </Avatar>
                                <div>
                                    <h1 className='text-3xl font-extrabold text-gray-900'>{singleJob?.title}</h1>
                                    <p className="text-lg text-gray-600">{singleJob?.company?.name}</p>
                                </div>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">Job Description</h2>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {singleJob?.description}
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Qualifications</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                {/* This is an example. You might need to parse this from the description or add a new field */}
                                <li>Bachelor's degree in Computer Science or related field.</li>
                                <li>{singleJob?.experience} years of experience in a similar role.</li>
                                <li>Proficiency in relevant technologies.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Summary Card */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Job Overview</h3>
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-700">
                                    <Briefcase size={20} className="mr-3 text-[#6A38C2]" />
                                    <div>
                                        <p className="font-semibold">Job Type</p>
                                        <p>{singleJob?.jobType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <MapPin size={20} className="mr-3 text-[#6A38C2]" />
                                    <div>
                                        <p className="font-semibold">Location</p>
                                        <p>{singleJob?.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <IndianRupee size={20} className="mr-3 text-[#6A38C2]" />
                                    <div>
                                        <p className="font-semibold">Salary</p>
                                        <p>{singleJob?.salary} LPA</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <GraduationCap size={20} className="mr-3 text-[#6A38C2]" />
                                    <div>
                                        <p className="font-semibold">Experience</p>
                                        <p>{singleJob?.experience} years</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Users size={20} className="mr-3 text-[#6A38C2]" />
                                    <div>
                                        <p className="font-semibold">Positions</p>
                                        <p>{singleJob?.position}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <Clock size={20} className="mr-3 text-[#6A38C2]" />
                                    <div>
                                        <p className="font-semibold">Posted</p>
                                        <p>{new Date(singleJob?.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={applyJobHandler}
                                disabled={isApplied}
                                className={`w-full mt-6 py-3 text-lg rounded-lg ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#6A38C2] hover:bg-[#5b30a6]'}`}>
                                {isApplied ? 'Already Applied' : 'Apply Now'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default JobDescription;
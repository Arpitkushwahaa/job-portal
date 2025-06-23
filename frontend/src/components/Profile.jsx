import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, FileText, Download } from 'lucide-react';
import { Badge } from './ui/badge';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import Footer from './shared/Footer';

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    const hasResume = user?.profile?.resume && user.profile.resume.length > 0;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className='max-w-6xl mx-auto py-12 px-6'>
                {/* Profile Card */}
                <div className='bg-white p-8 rounded-2xl shadow-lg mb-8'>
                    <div className='flex flex-col md:flex-row items-center justify-between'>
                        <div className='flex items-center gap-6 mb-6 md:mb-0'>
                            <Avatar className="h-28 w-28 border-4 border-indigo-100">
                                <AvatarImage src={user?.profile?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={user?.fullname} />
                            </Avatar>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900'>{user?.fullname}</h1>
                                <p className="text-gray-600 mt-1">{user?.profile?.bio || "No bio available."}</p>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)} variant="outline" className="flex items-center gap-2 py-2 px-4 border-gray-300 hover:bg-gray-100">
                            <Pen size={16} />
                            <span>Edit Profile</span>
                        </Button>
                    </div>

                    <div className="border-t border-gray-200 my-8"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {/* Contact Information */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                <div className='flex items-center gap-3 text-gray-700'>
                                    <Mail size={20} className="text-[#6A38C2]" />
                                    <span>{user?.email}</span>
                                </div>
                                <div className='flex items-center gap-3 text-gray-700'>
                                    <Contact size={20} className="text-[#6A38C2]" />
                                    <span>{user?.phoneNumber}</span>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills</h3>
                            <div className='flex flex-wrap items-center gap-2'>
                                {
                                    user?.profile?.skills?.length > 0 ? (
                                        user.profile.skills.map((item, index) => <Badge key={index} className="bg-indigo-100 text-indigo-800 text-md px-3 py-1">{item}</Badge>)
                                    ) : (
                                        <p className="text-gray-500">No skills added.</p>
                                    )
                                }
                            </div>
                        </div>

                        {/* Resume */}
                        <div className="md:col-span-2">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Resume</h3>
                            {
                                hasResume ? (
                                    <a 
                                        target='_blank' 
                                        href={user?.profile?.resume} 
                                        rel="noopener noreferrer"
                                        className='flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 p-4 rounded-lg border border-blue-200'
                                    >
                                        <FileText size={24} />
                                        <span className="font-medium">{user?.profile?.resumeOriginalName}</span>
                                        <Download size={20} className="ml-auto" />
                                    </a>
                                ) : (
                                    <p className="text-gray-500">No resume uploaded.</p>
                                )
                            }
                        </div>
                    </div>
                </div>

                {/* Applied Jobs Card */}
                <div className='bg-white p-8 rounded-2xl shadow-lg'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>Applied Jobs</h2>
                    <AppliedJobTable />
                </div>
            </div>
            <Footer />
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
}

export default Profile;
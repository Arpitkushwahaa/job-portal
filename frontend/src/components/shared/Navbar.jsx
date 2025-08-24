import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2, Camera, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import UpdateProfilePhotoDialog from './UpdateProfilePhotoDialog';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
                setIsMobileMenuOpen(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <div className='bg-white shadow-sm sticky top-0 z-50'>
                <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8'>
                    {/* Logo */}
                    <Link to="/" className='text-xl sm:text-2xl font-bold hover:scale-105 transition-transform duration-300 hover:text-[#6A38C2]'>
                        Job<span className='text-[#F83002]'>Portal</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center gap-8 lg:gap-12'>
                        <ul className='flex font-medium items-center gap-4 lg:gap-5'>
                            {
                                user && user.role === 'recruiter' ? (
                                    <>
                                        <li><Link to="/admin/companies" className='hover:text-[#6A38C2] transition-all duration-300 hover:scale-105 transform hover:font-semibold px-3 py-2 rounded-md hover:bg-gray-50'>Companies</Link></li>
                                        <li><Link to="/admin/jobs" className='hover:text-[#6A38C2] transition-all duration-300 hover:scale-105 transform hover:font-semibold px-3 py-2 rounded-md hover:bg-gray-50'>Jobs</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link to="/" className='hover:text-[#6A38C2] transition-all duration-300 hover:scale-105 transform hover:font-semibold px-3 py-2 rounded-md hover:bg-gray-50'>Home</Link></li>
                                        <li><Link to="/jobs" className='hover:text-[#6A38C2] transition-all duration-300 hover:scale-105 transform hover:font-semibold px-3 py-2 rounded-md hover:bg-gray-50'>Jobs</Link></li>
                                        <li><Link to="/browse" className='hover:text-[#6A38C2] transition-all duration-300 hover:scale-105 transform hover:font-semibold px-3 py-2 rounded-md hover:bg-gray-50'>Browse</Link></li>
                                    </>
                                )
                            }
                        </ul>
                        {
                            !user ? (
                                <div className='flex items-center gap-2'>
                                    <Link to="/login"><Button variant="outline" className='hover:scale-105 transition-transform duration-300 hover:shadow-md text-sm px-4 py-2'>Login</Button></Link>
                                    <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6] hover:scale-105 transition-all duration-300 hover:shadow-md text-sm px-4 py-2">Signup</Button></Link>
                                </div>
                            ) : (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Avatar className="cursor-pointer hover:scale-110 transition-transform duration-300 hover:shadow-md">
                                            <AvatarImage src={user?.profile?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={user?.fullname} />
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className=''>
                                            <div className='flex gap-2 space-y-2'>
                                                <Avatar className="cursor-pointer">
                                                    <AvatarImage src={user?.profile?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={user?.fullname} />
                                                </Avatar>
                                                <div>
                                                    <h4 className='font-medium'>{user?.fullname}</h4>
                                                    <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                                </div>
                                            </div>
                                            <div className='flex flex-col my-2 text-gray-600'>
                                                {
                                                    user && user.role === 'student' && (
                                                        <div className='flex w-fit items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors duration-300'>
                                                            <User2 />
                                                            <Button variant="link"> <Link to="/profile">View Profile</Link></Button>
                                                        </div>
                                                    )
                                                }
                                                <div className='flex w-fit items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors duration-300' onClick={() => setIsDialogOpen(true)}>
                                                    <Camera />
                                                    <Button variant="link">Change Photo</Button>
                                                </div>
                                                <div className='flex w-fit items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors duration-300'>
                                                    <LogOut />
                                                    <Button onClick={logoutHandler} variant="link">Logout</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )
                        }
                    </div>

                    {/* Mobile Menu Button */}
                    <div className='md:hidden'>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className='p-2'
                        >
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className='md:hidden border-t border-gray-200 bg-white'>
                        <div className='px-4 py-4 space-y-4'>
                            {/* Mobile Navigation Links */}
                            <div className='space-y-2'>
                                {user && user.role === 'recruiter' ? (
                                    <>
                                        <Link 
                                            to="/admin/companies" 
                                            onClick={closeMobileMenu}
                                            className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#6A38C2] hover:bg-gray-50 rounded-md transition-colors duration-200'
                                        >
                                            Companies
                                        </Link>
                                        <Link 
                                            to="/admin/jobs" 
                                            onClick={closeMobileMenu}
                                            className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#6A38C2] hover:bg-gray-50 rounded-md transition-colors duration-200'
                                        >
                                            Jobs
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            to="/" 
                                            onClick={closeMobileMenu}
                                            className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#6A38C2] hover:bg-gray-50 rounded-md transition-colors duration-200'
                                        >
                                            Home
                                        </Link>
                                        <Link 
                                            to="/jobs" 
                                            onClick={closeMobileMenu}
                                            className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#6A38C2] hover:bg-gray-50 rounded-md transition-colors duration-200'
                                        >
                                            Jobs
                                        </Link>
                                        <Link 
                                            to="/browse" 
                                            onClick={closeMobileMenu}
                                            className='block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#6A38C2] hover:bg-gray-50 rounded-md transition-colors duration-200'
                                        >
                                            Browse
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile Authentication Buttons */}
                            {!user ? (
                                <div className='pt-4 border-t border-gray-200 space-y-3'>
                                    <Link to="/login" onClick={closeMobileMenu}>
                                        <Button variant="outline" className='w-full hover:scale-105 transition-transform duration-300 hover:shadow-md'>
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/signup" onClick={closeMobileMenu}>
                                        <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] hover:scale-105 transition-all duration-300 hover:shadow-md">
                                            Signup
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className='pt-4 border-t border-gray-200 space-y-3'>
                                    <div className='flex items-center gap-3 px-3 py-2'>
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user?.profile?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={user?.fullname} />
                                        </Avatar>
                                        <div>
                                            <h4 className='font-medium text-gray-900'>{user?.fullname}</h4>
                                            <p className='text-sm text-gray-500'>{user?.profile?.bio}</p>
                                        </div>
                                    </div>
                                    
                                    {user && user.role === 'student' && (
                                        <Link 
                                            to="/profile" 
                                            onClick={closeMobileMenu}
                                            className='flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#6A38C2] hover:bg-gray-50 rounded-md transition-colors duration-200'
                                        >
                                            <User2 className="h-4 w-4" />
                                            <span>View Profile</span>
                                        </Link>
                                    )}
                                    
                                    <button 
                                        onClick={() => {
                                            setIsDialogOpen(true);
                                            closeMobileMenu();
                                        }}
                                        className='flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#6A38C2] hover:bg-gray-50 rounded-md transition-colors duration-200 w-full text-left'
                                    >
                                        <Camera className="h-4 w-4" />
                                        <span>Change Photo</span>
                                    </button>
                                    
                                    <button 
                                        onClick={logoutHandler}
                                        className='flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[#6A38C2] hover:bg-gray-50 rounded-md transition-colors duration-200 w-full text-left'
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <UpdateProfilePhotoDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </>
    )
}

export default Navbar;
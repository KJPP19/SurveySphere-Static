/* eslint-disable react/prop-types */
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function NavBar ({isAuthenticated, onLogout, userInfo}) {
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    
    const handleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        navigate("/login");
        onLogout();
    };
    
    return (
        <nav className="p-2 border w-screen border-t-0">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="font-raleway font-semibold">SurveySphere</Link>
                <div className="flex items-center space-x-4 font-raleway text-sm">
                    {isAuthenticated ? (
                        <>
                            <div>menuitems</div>
                            <div className='relative'>
                                <button onClick={handleDropdown} className='border border-[#848484] hover:bg-[#848484] p-2 rounded-full font-semibold'>{userInfo.initials}</button>
                                {isDropdownOpen && (
                                    <div className='z-10 absolute shadow-md bg-white right-0 mt-3 divide-y'>
                                            <div className='py-3 pl-2 pr-20'>
                                                <div className='text-lg font-semibold'>{userInfo.name}</div>
                                                <div className='font-semibold'>{userInfo.email}</div>
                                            </div>
                                            <div className='py-3 pl-2 pr-20'>
                                                <button>Settings</button>
                                            </div>
                                            <div className='py-3 pl-2 pr-20'>
                                                <button onClick={handleLogout} className='text-red-700 font-semibold'>Logout</button>
                                            </div>
                                    </div>
                                )}
                            </div>
                            
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="cursor-pointer hover:text-[#3d3d3d]">Log in</Link>
                            <Link to="/signup" className="bg-[#000000] p-2 rounded-md text-[#FFFFFF] cursor-pointer hover:bg-[#3d3d3d]">Sign up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default NavBar;
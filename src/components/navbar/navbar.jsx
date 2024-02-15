/* eslint-disable react/prop-types */
import { Link, useNavigate} from 'react-router-dom';
import useToggle from '../../hooks/useToggle';
import DropDown from '../dropdown/dropdown';

function NavBar ({isAuthenticated, onLogout, userInfo, menuItems, currentPath}) {
    
    const profileDropdown = useToggle(false);
    const navigate = useNavigate();

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
                            {menuItems && (
                                <div className='flex flex-row space-x-5 mr-5'>
                                    {menuItems.map((item => (
                                        <div key={item.id}>
                                            <Link to={item.link} className={currentPath && currentPath === item.link ? 'font-semibold text-black border-b-black border-b-2' : 'text-gray-500'}>{item.name}</Link>
                                        </div>
                                    )))}
                                </div>
                            )}
                            <div>
                                <button onClick={profileDropdown.toggle} className='bg-gray-100 text-[#848484] border hover:text-black hover:bg-gray-300 p-2 rounded-full font-semibold'>{userInfo.initials}</button>
                                <DropDown isOpen={profileDropdown.isOpen}>
                                    <>
                                        <div className='py-3 pl-2 pr-20'>
                                            <div className='text-md font-semibold'>{userInfo.name}</div>
                                            <div className='text-gray-400 text-xs'>{userInfo.email}</div>
                                        </div>
                                        <div className='py-3 pl-2 pr-20'>
                                            <button className='text-xs'>Settings</button>
                                        </div>
                                        <div className='py-3 pl-2 pr-20'>
                                            <button onClick={handleLogout} className='text-red-700 font-semibold text-xs'>Logout</button>
                                        </div>
                                    </>
                                </DropDown>
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
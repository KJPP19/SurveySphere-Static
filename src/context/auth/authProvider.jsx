import authContext from "./authContext";
import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
   
    const getUserFromLocalStorage = () => {
        const user = localStorage.getItem('user');
        try {
            const userInfo = user ? JSON.parse(user) : null;
            if (userInfo.id && userInfo.email && userInfo.name && userInfo.initials) {
                return userInfo;
            }
        } catch (error) {
            localStorage.removeItem('user');
            return null;
        }
    };
   
    const [ isAuthenticated, setIsAuthenticated ] = useState(() => {
        const userFromStorage = getUserFromLocalStorage();
        return !!userFromStorage;
    });
    
    const [sessionError, setSessionError] = useState('');

    const authenticateUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
    };

    const deauthenticateUser = (error) => {
        setSessionError(error);
        localStorage.removeItem('user');
        setIsAuthenticated(false);
    };

    return (
        <authContext.Provider value={{isAuthenticated, authenticateUser, deauthenticateUser, sessionError, setSessionError, getUserFromLocalStorage}}>
            {children}
        </authContext.Provider>
    )
};


export default AuthProvider;
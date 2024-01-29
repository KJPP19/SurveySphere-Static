import authContext from "../context/auth/authContext";
import { useContext } from 'react';

const useAuth = () => {
    const context = useContext(authContext);
    return context;
};

export default useAuth;
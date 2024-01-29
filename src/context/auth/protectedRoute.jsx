import useAuth from "../../hooks/useAuth";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Outlet/> : <Navigate to="/login"/>
};

export default ProtectedRoute;
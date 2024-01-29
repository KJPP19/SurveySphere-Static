import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import login from '../services/api/apiLogin';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/forms/authForm';

function LogIn () {
    const { authenticateUser, isAuthenticated, sessionError, setSessionError } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    
    console.log("isauthenticated", isAuthenticated);

    useEffect(() => {
        if(isAuthenticated) {
            navigate("/workspace");
        }
        if(sessionError){
            setLoginError(sessionError);
            setSessionError('');
        }
    }, [isAuthenticated, navigate, sessionError, setSessionError])

    const handleLogin = async (formData) => {
        try {
            setIsLoading(true);
            const response = await login(formData);
            authenticateUser(response.data.user);
            console.log("success", response.data);
            navigate("/workspace");
        } catch (error) {
            setLoginError(error.response.data.error);
            console.error("error during login", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loginFields = [
        {id: 'email', label: 'Email Address', type: 'email', placeholder: 'name@mail.com'},
        {id: 'password', label: 'Password', type: 'password', placeholder: '••••••••'},
    ];
    
    const clearLoginError = () => {
        setLoginError('')
    };

    return (
        <AuthForm formType="Signin" fields={loginFields} onSubmit={handleLogin} isLoading={isLoading} formError={loginError} linkTo="/signup" linkText="No account yet?" clearFormError={clearLoginError}/>
    );
}

export default LogIn;
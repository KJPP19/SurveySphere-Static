import AuthForm from "../components/forms/authForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import signup from "../services/api/apiSignup";

function SignUp () {
    const [isLoading, setIsLoading] = useState(false);
    const [signupError, setSignupError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (formData) => {
        try {
            setIsLoading(true);
            const response = await signup(formData);
            console.log("signup ok", response.data);
            navigate("/login");
        } catch (error) {
            setSignupError(error.response.data.error);
            console.error("error during signup", error);
        } finally {
            setIsLoading(false);
        }
    }

    const registerFields = [
        {id: 'firstname', label: 'Firstname', type: 'text', placeholder: 'created'},
        {id: 'lastname', label: 'Lastname', type: 'text', placeholder: 'by'},
        {id: 'email', label: 'Email Address', type: 'email', placeholder: 'keanponio@mail.com'},
        {id: 'password', label: 'Password', type: 'password', placeholder: '••••••••'},
        {id: 'confirmpassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••'},
    ];
    
    const clearSignupError = () => {
        setSignupError('');
    };

    return (
        <AuthForm formType='Sign Up' fields={registerFields} onSubmit={handleSignup} isLoading={isLoading} formError={signupError} linkTo="/login" linkText="Have an account?" clearFormError={clearSignupError}/>
    )
}

export default SignUp;
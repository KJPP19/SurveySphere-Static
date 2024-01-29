/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Link } from 'react-router-dom';

function AuthForm ({formType, fields, onSubmit, isLoading, formError, linkTo, linkText, clearFormError}) {
    const [ formData, setFormData ] = useState({});
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
        clearFormError();
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="flex flex-col justify-center items-center mx-auto py-16 font-raleway">
            <div className="font-semibold text-2xl mb-6">SurveySphere</div>
            <div className="shadow-md rounded-lg p-6 space-y-4 w-80">
                <div className="font-semibold text-lg">{formType}</div>
                    {formError && (
                        <div className='text-xs p-2 bg-red-100 border border-red-400 text-red-700'>{formError}</div>
                    )}
                    <form className='flex flex-col' onSubmit={handleSubmit}>
                        {fields.map((field => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className='text-sm'>{field.label}</label>
                                <input type={field.type} id={field.id} placeholder={field.placeholder} value={formData[field.id] || ''} onChange={handleInputChange} disabled={isLoading} className="border p-2 text-sm rounded-sm w-full focus:outline-none focus:border-[#000000] mb-3"/>
                            </div>
                        )))}
                        <button type="submit" disabled={isLoading} className={`bg-[#000000] text-[#ffffff] p-3 rounded-sm flex justify-center items-center hover:bg-[#3d3d3d] cursor-pointer ${isLoading ? 'opacity-70 cursor-wait' : ''}`}>
                            <div className="text-xs font-semibold tracking-wider">{isLoading ? `${formType.toLowerCase()}...` : `${formType}`}</div>
                        </button>
                    </form>
                    <div className='mt-4 flex items-center text-xs'>
                        <div className='mr-1'>{linkText}</div>
                        <div>
                            <Link to={linkTo} className='font-semibold hover:text-[#3d3d3d]'>{formType === 'Signin' ? 'Signup' : 'Signin'}</Link>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default AuthForm;
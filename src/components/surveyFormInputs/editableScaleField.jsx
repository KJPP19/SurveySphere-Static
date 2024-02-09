/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
//import useToggle from "../../hooks/useToggle";
import { addRangeInQuestion } from '../../services/api/apiQuestion';
const ScaleInput = ({question}) => {
    const { deauthenticateUser } = useAuth();
    const [ scaleRange, setScaleRange ] = useState([]);
    const [ selectedMinValue, setSelectedMinValue ] = useState(null);
    const [ selectedMaxValue, setSelectedMaxValue ] = useState(null);

    useEffect(() => {
        setScaleRange(question.labels || [])
    }, [question.labels]);

    const handleSessionExpiration = (error) => {
        if(error.response.data.status === 401 && error.response.data.error === "your session has expired, please login again"){
          deauthenticateUser(error.response.data.error);
        }
        return error;
    };

    const generateRange = () => {
        
        if(!scaleRange || scaleRange.length === 0) {
            return [];
        }

        const minValue = Math.min(...scaleRange);
        const maxValue = Math.max(...scaleRange);

        const range = [];
        for (let i = minValue; i <= maxValue; i++) {
            range.push(i);
        }
        return range;
    };

    const handleSubmitRangeValue = async () => {
        try {
            const response = await addRangeInQuestion(question._id, selectedMinValue, selectedMaxValue);
            setScaleRange(response.data.data.labels);
        } catch (error) {
            handleSessionExpiration(error);
        }
    };

    const range = generateRange();

    const minOptions = [0, 1];
    const maxOptions = [5, 6, 7, 8, 9, 10];

    return (
        <div className='w-full space-y-1'>
            {scaleRange && scaleRange.length > 0 ? (
                <div className='flex flex-row space-x-1'>
                    {range.map((value, index) => (
                        <div className='border p-4' key={index}>{value}</div>
                    ))}
                </div>
            ) : (
                <div className='flex flex-row items-center justify-between'>
                    <div>
                        <select className='border-b text-sm' value={selectedMinValue} onChange={(e) => setSelectedMinValue(e.target.value)}>
                            <option value="">Select Min. Value</option>
                            {minOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className='text-sm'>to</div>
                    <div>
                        <select className='border-b text-sm' value={selectedMaxValue} onChange={(e) => setSelectedMaxValue(e.target.value)}>
                            <option value="">Select Max Value</option>
                            {maxOptions.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleSubmitRangeValue} className='text-sm p-2 rounded-sm text-white bg-black font-semibold tracking-wider hover:opacity-50'>Apply range</button>
                </div>
            )}
        </div>
    )

};

export default ScaleInput;
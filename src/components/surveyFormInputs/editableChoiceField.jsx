/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useToggle from "../../hooks/useToggle";
import { addChoiceInQuestion, deleteChoiceInQuestion } from '../../services/api/apiQuestion'; 

const ChoiceInput = ({question}) => {
    const { deauthenticateUser } = useAuth();
    const isAddingChoice = useToggle(false);
    const [ choiceList, setChoiceList ] = useState([]);
    const [ newChoice, setNewChoice ] = useState('');

    useEffect(() => {
        setChoiceList(question.labels || []);
    }, [question.labels]);

    const handleSessionExpiration = (error) => {
        if(error.response.data.status === 401 && error.response.data.error === "your session has expired, please login again"){
          deauthenticateUser(error.response.data.error);
        }
        return error;
    };

    const handleAddChoice = async () => {
        if (newChoice.trim() !== '') {
            try {
                const response = await addChoiceInQuestion(question._id, newChoice);
                setChoiceList(response.data.data.labels)
            } catch (error) {
                handleSessionExpiration(error);
            } finally {
                setNewChoice('');
            }
        }
        isAddingChoice.toggle();
    };

    const handleDeleteChoice = async (selectedChoice) => {
        try {
            const response = await deleteChoiceInQuestion(question._id, selectedChoice)
            setChoiceList(response.data.data.labels);
        } catch (error) {
            handleSessionExpiration(error);
        }
    };

    return (
        <div className="w-full space-y-1">
            {choiceList.map((choice, index) => (
                <div className="flex items-center group justify-between p-1 hover:bg-gray-200" key={index}>
                    <div className="flex flex-row items-center space-x-2">
                        <input disabled type="radio" id={`choice-${index}`} name="choices" value={choice}/>
                        <div className='text-sm text-wrap' htmlFor={`choice-${index}`}>{choice}</div>
                    </div>
                    <button onClick={() => handleDeleteChoice(choice)} className='opacity-0 group-hover:opacity-100 hover:text-red-700 text-red-500'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            ))}
            {isAddingChoice.isOpen ? (
                <input autoFocus value={newChoice} onChange={(e) => setNewChoice(e.target.value)} onBlur={handleAddChoice} className='items-center border w-fit py-2 pl-1 pr-3 font-semibold rounded-sm outline-none'/>
            ) : (
                <button onClick={isAddingChoice.toggle} className="flex flex-row items-center border w-fit py-2 pl-1 pr-3 font-semibold rounded-sm hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <div className="text-sm">add choice</div>
                </button>
            )}
        </div>
    )
}

export default ChoiceInput;
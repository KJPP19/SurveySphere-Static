/* eslint-disable react/prop-types */
const EditableField = ({isEditing, value, inputChange, onFinishEditing, handleButtonClick, placeholder, buttonText}) => {

    return (
        <>
            {isEditing.isOpen ? (
                <input autoFocus value={value} onChange={inputChange} onBlur={onFinishEditing} className="border font-semibold text-md tracking-wider rounded-md p-2 focus:outline-none"/>
            ) : (
                <button onClick={() => handleButtonClick()} className="border text-justify font-semibold text-md tracking-wider rounded-md p-2 hover:opacity-50 transition-opacity duration-300">
                    {buttonText || placeholder}
                </button>
            )}
        </>
    )
}

export default EditableField;
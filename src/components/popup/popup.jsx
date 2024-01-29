/* eslint-disable react/prop-types */
const Popup = ({ isOpen, onClose, children }) => {

    return (
        <>
            {isOpen && (
                <div className='bg-[rgba(0,0,0,0.5)] fixed w-full h-full top-0 left-0 z-50 flex items-center justify-center font-raleway'>
                    <div className='bg-white p-4 rounded-sm'>
                            <button onClick={onClose} className="ml-auto flex justify-items-end">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 hover:text-red-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                            {children}
                    </div>
                </div>
            )}
        </>
    )
};

export default Popup;
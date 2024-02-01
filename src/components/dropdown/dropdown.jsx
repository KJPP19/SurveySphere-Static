const DropDown = ({isOpen, children}) => {

    return (
        <>
            {isOpen && (
                <div className="relative">
                    <div className='z-10 absolute shadow-md bg-white right-0 mt-3 divide-y'>
                        {children}
                    </div>
                </div>
            )}
        </>
    )
};

export default DropDown;
import { useState } from "react";

const useToggle = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const toggle = () => {
        setIsOpen((prev) => !prev);
    };

    return {isOpen, toggle};
};

export default useToggle
import React, { useContext, useState } from "react";

const ModalContext = React.createContext({ isOpenModal: false, openModal: () => { }, closeModal: () => { } });

export function useModal() {
    return useContext(ModalContext);
}

export function ModalProvider({ children }) {
    const [isOpenModal, setIsOpenModal] = useState(false);

    const openModal = () => {
        setIsOpenModal(true);
    };
    const closeModal = () => {
        setIsOpenModal(false);
    };

    return (
        <ModalContext.Provider
            value={{ isOpenModal, openModal, closeModal }}
        >
            {children}
        </ModalContext.Provider>
    );
}
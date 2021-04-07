import React from "react";
import { ModalProvider } from "./ModalContext";
const TelemojiContext = React.createContext({});

export function TelemojiProvider({ children }) {
    return (
        <TelemojiContext.Provider value>
            <ModalProvider>
                {children}
            </ModalProvider>
        </TelemojiContext.Provider>
    );
}
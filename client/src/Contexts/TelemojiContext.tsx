import React from "react";
import { ModalProvider } from "./ModalContext";
import { LoaderProvider } from './LoaderContext';
const TelemojiContext = React.createContext({});

export function TelemojiProvider({ children }) {
    return (
        <TelemojiContext.Provider value>
            <ModalProvider>
                <LoaderProvider>
                    {children}
                </LoaderProvider>
            </ModalProvider>
        </TelemojiContext.Provider>
    );
}
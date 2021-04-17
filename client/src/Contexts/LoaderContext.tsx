import React, { useContext, useState } from "react";

const LoaderContext = React.createContext({ isLoading: false, startLoading: () => { }, finishLoading: () => { } });

export function useLoader() {
    return useContext(LoaderContext);
}

export function LoaderProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => {
        setIsLoading(true);
    };
    const finishLoading = () => {
        setIsLoading(false);
    };

    return (
        <LoaderContext.Provider value={{ isLoading, startLoading, finishLoading }}>
            {children}
        </LoaderContext.Provider>
    );
}
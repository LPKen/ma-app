import React, {createContext, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);

    const login = () => {
        setUserToken("t",Math.floor(Math.random()*1000000));
        setIsLoading(false);
    }
    const logout = () => {
        setUserToken(null);
        setIsLoading(false);
    }
    return (
        <AuthContext.Provider value={{login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

interface UserData {
    // Update according to the shape of your decoded token payload
    id: string;
    email: string;
    name?: string;
    [key: string]: any;
}

interface AuthContextType {
    userData: UserData | null;
    setUserData: (user: UserData | null) => void;
    setToken: (token: string) => void; // Function to set the token
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies.token;

        if (token) {
            try {
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = atob(payloadBase64);
                const user: UserData = JSON.parse(decodedPayload);
                setUserData(user);
            } catch (error) {
                console.error('Invalid token:', error);
                destroyCookie(null, 'token');
            }
        }
    }, []);

    const setToken = (token: string) => {
        try {
            setCookie(null, 'token', token, {
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: '/',
            });

            const payloadBase64 = token.split('.')[1];
            const decodedPayload = atob(payloadBase64);
            const user: UserData = JSON.parse(decodedPayload);
            setUserData(user);
        } catch (error) {
            console.error('Error setting token:', error);
            destroyCookie(null, 'token');
            setUserData(null);
        }
    };

    const logout = () => {
        destroyCookie(null, 'token');
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ userData, setUserData, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
// // context/AuthContext.tsx
// "use client"
// import { createContext, useContext, useState, ReactNode } from 'react';

// type AuthContextType = {
//     userData: object | null;
//     setUserData: (token: object | null) => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//     const [userData, setUserData] = useState<object | null>(null);

//     return (
//         <AuthContext.Provider value={{ userData, setUserData }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (context === undefined) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };
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

    const logout = () => {
        destroyCookie(null, 'token');
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ userData, setUserData, logout }}>
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


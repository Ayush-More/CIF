'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { jwtDecode } from "jwt-decode";

interface UserData {
    userId?: string;
    id?: string;
    email: string;
    name?: string;
    exp?: number;
    [key: string]: any;
}

interface AuthContextType {
    userData: UserData | null;
    setUserData: (user: UserData | null) => void;
    setToken: (token: string) => void;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserFromToken = () => {
            try {
                const cookies = parseCookies();
                const token = cookies.token;

                if (token) {
                    const decoded = jwtDecode<UserData>(token);
                    const currentTime = Math.floor(Date.now() / 1000);

                    if (decoded.exp && decoded.exp > currentTime) {
                        setUserData(decoded);
                    } else {
                        destroyCookie(null, 'token', { path: '/' });
                        setUserData(null);
                    }
                } else {
                    setUserData(null);
                }
            } catch (error) {
                console.error('Error loading user from token:', error);
                destroyCookie(null, 'token', { path: '/' });
                setUserData(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUserFromToken();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'auth_trigger') {
                loadUserFromToken();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const setToken = (token: string) => {
        try {
            setCookie(null, 'token', token, {
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });

            const decoded = jwtDecode<UserData>(token);
            setUserData(decoded);

            window.localStorage.setItem('auth_trigger', Date.now().toString());
        } catch (error) {
            console.error('Error setting token:', error);
            destroyCookie(null, 'token', { path: '/' });
            setUserData(null);
        }
    };

    const logout = async () => {
        try {
            // Call the logout API endpoint
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Logout request failed');
            }

            // Clear the token cookie
            destroyCookie(null, 'token', { path: '/' });
            
            // Clear user data
            setUserData(null);
            
            // Clear local storage items
            localStorage.removeItem('userId');
            localStorage.removeItem('email');
            
            // Trigger auth state update in other tabs
            window.localStorage.setItem('auth_trigger', Date.now().toString());
            
            return Promise.resolve();
        } catch (error) {
            console.error('Logout failed:', error);
            return Promise.reject(error);
        }
    };

    return (
        <AuthContext.Provider value={{ userData, setUserData, setToken, logout, isLoading }}>
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
}
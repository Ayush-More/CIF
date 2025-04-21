import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';

interface UserData {
  userId?: string;
  id?: string;
  email: string;
  name?: string;
  exp?: number;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  const router = useRouter();

  // Check authentication status
  const checkAuth = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies.token;

      if (!token) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          loading: false,
        }));
        return false;
      }

      const decoded = jwtDecode<UserData>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp > currentTime) {
        setAuthState({
          isAuthenticated: true,
          user: decoded,
          loading: false,
          error: null,
        });
        return true;
      } else {
        await logout();
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Authentication check failed',
      });
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        destroyCookie(null, 'token', { path: '/' });
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
        window.localStorage.setItem('auth_trigger', Date.now().toString());
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setAuthState(prev => ({
        ...prev,
        error: 'Logout failed',
      }));
    }
  };

  // Update auth state based on token changes
  useEffect(() => {
    checkAuth();

    // Listen for auth changes in other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_trigger') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    ...authState,
    checkAuth,
    logout,
  };
};
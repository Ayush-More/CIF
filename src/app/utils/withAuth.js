import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwtDecode from 'jwt-decode';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1]; // Fetch token from cookies

      if (!token) {
        router.push('/login'); // Redirect to the login page
        return;
      }

      try {
        const decoded = jwtDecode(token);
        // Optional: Check expiration
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          document.cookie = 'token=; Max-Age=0'; // Clear the cookie
          router.push('/login');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        router.push('/login');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
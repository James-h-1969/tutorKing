import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return; // Do nothing while loading

      // If not authenticated, redirect to login page
      if (!session) {
        router.push('/api/auth/signin'); // Redirect to your login page
      }
    }, [session, status, router]);

    // If not authenticated, return null or a loading state
    if (status === 'loading' || !session) {
      return <div>Loading...</div>; // You can customize this loading state
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

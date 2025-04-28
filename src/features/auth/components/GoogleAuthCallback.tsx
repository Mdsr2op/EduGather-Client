import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCheckGoogleAuthStatusQuery } from '../slices/authApiSlice';
import { toast } from 'react-hot-toast';

export function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, isError } = useCheckGoogleAuthStatusQuery();

  useEffect(() => {
    // Check for error message in URL (in case backend redirected with error)
    const params = new URLSearchParams(location.search);
    const errorMessage = params.get('message');
    
    if (errorMessage) {
      toast.error(`Authentication failed: ${errorMessage}`);
      navigate('/sign-in');
      return;
    }

    // If we have data and no errors, authentication was successful
    if (data && !isLoading && !isError) {
      toast.success('Successfully signed in with Google!');
      navigate('/');
    } else if (isError) {
      toast.error('Failed to verify authentication. Please try again.');
      navigate('/sign-in');
    }
  }, [data, isLoading, isError, navigate, location.search]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Processing Google Authentication</h2>
        <p className="text-gray-600">Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
} 
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
      const user = data.data;
      
      // Check if user needs to complete profile
      // This assumes Google auth might set username to email initially 
      // or leave it empty/undefined
      if (!user.username || user.username === user.email) {
        toast.success('Successfully authenticated with Google!');
        navigate('/complete-profile');
      } else {
        toast.success('Successfully signed in with Google!');
        navigate('/');
      }
    } else if (isError) {
      toast.error('Failed to verify authentication. Please try again.');
      navigate('/sign-in');
    }
  }, [data, isLoading, isError, navigate, location.search]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-1">
      <div className="text-center p-6 bg-dark-3 rounded-xl shadow-lg max-w-md w-full">
        <div className="mx-auto w-16 h-16 mb-6 bg-primary-500/20 rounded-full flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-light-1 mb-2">Processing Google Authentication</h2>
        <p className="text-light-3">Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
} 
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';
import { 
  useGetStreamConfigQuery, 
  useGetStreamTokenQuery, 
  useCreateUpdateStreamUserMutation 
} from '../slices/streamApiSlice';
import { 
  setStreamInitialized, 
  selectStreamApiKey, 
  selectStreamToken, 
  selectStreamInitialized
} from '../slices/streamSlice';

/**
 * Hook to initialize Stream Video client connection
 * - Fetches Stream API key from the backend
 * - Gets user-specific Stream token when user is authenticated
 * - Creates/updates the Stream user profile
 */
export const useStreamInit = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const apiKey = useSelector(selectStreamApiKey);
  const token = useSelector(selectStreamToken);
  const isInitialized = useSelector(selectStreamInitialized);
  
  // Always fetch the Stream API key configuration
  const { isLoading: isLoadingConfig } = useGetStreamConfigQuery();
  
  // Only fetch token and create user when we have a logged-in user
  const { isLoading: isLoadingToken } = useGetStreamTokenQuery(undefined, {
    skip: !currentUser,
  });
  
  const [createUpdateUser, { isLoading: isUpdatingUser }] = useCreateUpdateStreamUserMutation();
  
  // Initialize Stream user when user is logged in
  useEffect(() => {
    const initializeStream = async () => {
      if (currentUser && apiKey && !isInitialized) {
        try {
          // Create/update the Stream user profile
          await createUpdateUser();
          
          // Mark Stream as initialized
          dispatch(setStreamInitialized(true));
          console.log('Stream Video client initialized successfully');
        } catch (error) {
          console.error('Error initializing Stream Video:', error);
        }
      }
    };
    
    initializeStream();
  }, [currentUser, apiKey, isInitialized, createUpdateUser, dispatch]);
  
  return {
    isLoading: isLoadingConfig || isLoadingToken || isUpdatingUser,
    isInitialized,
    apiKey,
    token,
  };
}; 
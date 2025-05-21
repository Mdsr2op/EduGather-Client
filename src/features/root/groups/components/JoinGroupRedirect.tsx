import React, { useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useJoinGroupMutation, useJoinGroupByInviteMutation } from '../slices/groupApiSlice';
import { toast } from 'react-hot-toast';

const JoinGroupRedirect: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isInvite = queryParams.get('invite') === 'true';
  
  const [joinGroup] = useJoinGroupMutation();
  const [joinGroupByInvite] = useJoinGroupByInviteMutation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // Use callback instead of effect to have more control
  const attemptJoin = useCallback(async () => {
    // Clear any existing toasts to prevent duplicates
    toast.dismiss();
    
    if (!groupId) {
      setStatus('error');
      toast.error('Invalid group link');
      return;
    }

    try {
      // Attempt to join the group using the appropriate method
      if (isInvite) {
        await joinGroupByInvite({ groupId }).unwrap();
      } else {
        await joinGroup({ groupId }).unwrap();
      }
      
      setStatus('success');
      toast.success('Successfully joined the group!');
      
      // Delayed redirect
      setTimeout(() => {
        navigate(`/${groupId}/channels`);
      }, 1500);
    } catch (error) {
      console.error('Failed to join group:', error);
      setStatus('error');
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as any)?.data?.message || 'Failed to join the group. You may already be a member or the group does not exist.';
      toast.error(errorMessage);
    }
  }, [groupId, joinGroup, joinGroupByInvite, isInvite, navigate]);

  // Buttons for manual actions (more reliable than auto-join)
  const handleJoinClick = () => {
    setStatus('loading');
    attemptJoin();
  };

  const handleCancelClick = () => {
    navigate('/discover-groups');
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-dark-2">
      <div className="bg-white dark:bg-dark-3 p-8 rounded-xl max-w-md w-full text-center shadow-lg">
        {status === 'loading' && (
          <>
            <div className="animate-pulse mb-4 mx-auto w-12 h-12 rounded-full bg-primary-500/30"></div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-light-1 mb-2">
              {isInvite ? 'You\'ve been invited to join this group!' : 'Ready to join this group?'}
            </h1>
            <p className="text-gray-600 dark:text-light-3 mb-6">Click the button below to join this group.</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleJoinClick}
                className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors w-full shadow-sm"
              >
                {isInvite ? 'Accept Invitation' : 'Join Group'}
              </button>
              <button 
                onClick={handleCancelClick}
                className="px-4 py-2 border border-gray-200 dark:border-dark-4 text-gray-600 dark:text-light-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-4 transition-colors w-full"
              >
                Cancel
              </button>
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-light-1 mb-2">Failed to join group</h1>
            <p className="text-gray-600 dark:text-light-3 mb-4">There was an issue joining the group. You may already be a member or the group doesn't exist.</p>
            <button 
              onClick={() => navigate('/discover-groups')} 
              className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-sm"
            >
              Discover Groups
            </button>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-light-1 mb-2">Successfully joined!</h1>
            <p className="text-gray-600 dark:text-light-3 mb-4">You will be redirected to the group momentarily...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default JoinGroupRedirect; 
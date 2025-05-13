import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ViewUserProfile from '../components/ViewUserProfile';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';

const ProfilePage: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <Button 
          onClick={() => setIsProfileOpen(true)}
          className="bg-primary-500 hover:bg-primary-600"
        >
          View Profile
        </Button>

        <ViewUserProfile 
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={user}
        />
      </div>
    </div>
  );
};

export default ProfilePage; 
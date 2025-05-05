import React from "react";
import { User } from "@/features/auth/types";

interface UserAvatarProps {
  user: User | null;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, onClick }) => {
  
  // If no user is provided, show a placeholder
  if (!user) {
    return (
      <div
        className="w-12 h-12 rounded-full bg-dark-4 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all duration-300"
        onClick={onClick}
      >
        <span className="text-light-2 text-lg font-semibold">?</span>
      </div>
    );
  }

  // Determine what to display - avatar or initials
  const displayAvatar = user.avatar && user.avatar.trim() !== "";
  const userInitial = user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase();

  return (
    <div 
      className="relative cursor-pointer hover:scale-110 transition-transform duration-300"
        onClick={onClick}
      >
        {displayAvatar ? (
          <img
            src={user.avatar}
            alt={`${user.username}'s avatar`}
            className="w-12 h-12 rounded-full object-cover border-2 border-light-3 hover:border-primary-500 transition-colors duration-300"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-dark-1 text-lg font-bold border-2 border-light-3 hover:border-primary-500 transition-colors duration-300">
            {userInitial}
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-1"></div>
    </div>
  );
};

export default UserAvatar; 
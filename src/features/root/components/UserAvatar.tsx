import React from "react";
import { User } from "@/features/auth/types";
import { MdAccountCircle } from "react-icons/md";

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
        title="Sign in"
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
      className="relative cursor-pointer group"
      onClick={onClick}
      title="View profile"
    >
      <div className="relative overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-lg rounded-full">
        {displayAvatar ? (
          <img
            src={user.avatar}
            alt={`${user.username}'s avatar`}
            className="w-12 h-12 rounded-full object-cover border-2 border-light-3 group-hover:border-primary-500 transition-colors duration-300"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-dark-1 text-lg font-bold border-2 border-light-3 group-hover:border-primary-500 transition-colors duration-300">
            {userInitial}
          </div>
        )}
        
        {/* Hover overlay with profile icon */}
        <div className="absolute inset-0 bg-dark-1 bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <MdAccountCircle className="text-primary-500 text-lg" />
        </div>
      </div>
      
      {/* Online status indicator */}
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-1"></div>
    </div>
  );
};

export default UserAvatar; 
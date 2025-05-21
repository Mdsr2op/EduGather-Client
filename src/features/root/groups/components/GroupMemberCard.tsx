import { useState, useRef } from 'react';
import { MdSettings } from 'react-icons/md';
import RoleMenu from './RoleMenu';
import { useAppSelector } from '@/redux/hook';
import { useTheme } from '@/context/ThemeContext';

interface GroupMember {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface GroupMemberCardProps {
  member: GroupMember;
  isAdmin?: boolean;
  groupId: string;
  currentUserRole?: string;
}

const GroupMemberCard = ({ 
  member, 
  isAdmin = false,
  groupId,
  currentUserRole = 'member'
}: GroupMemberCardProps) => {
  const { theme } = useTheme();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Get current user ID from auth state
  const currentUserId = useAppSelector(state => state.auth.user?._id);
  const isCurrentUser = currentUserId === member._id;
  
  const isAdminMember = member.role === 'admin';
  const isModeratorMember = member.role === 'moderator';
  const isRegularMember = !isAdminMember && !isModeratorMember;
  
  const handleToggleMenu = () => {
    setShowRoleMenu(prev => !prev);
  };

  // Determine if we should show the gear icon
  const shouldShowGear = 
    // Admins can manage all users
    isAdmin || 
    // Moderators can only manage regular members
    (currentUserRole === 'moderator' && isRegularMember) ||
    // Allow moderators to see settings for their own card
    (isCurrentUser && currentUserRole === 'moderator');
  
  return (
    <div 
      className={`flex items-center justify-between mb-3 p-3 rounded-xl transition-all border border-transparent ${
        theme === 'dark'
          ? 'hover:bg-dark-1/40 hover:border-dark-1'
          : 'hover:bg-light-bg-4/40 hover:border-light-bg-4'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={member.avatar || 'https://via.placeholder.com/80'}
            alt={`${member.username} Avatar`}
            className={`w-10 h-10 rounded-full object-cover ring-1 ${
              isAdminMember ? 'ring-primary-500' : 
              isModeratorMember ? 'ring-purple-500' : 
              theme === 'dark' ? 'ring-dark-1' : 'ring-light-bg-4'
            }`}
          />
          {isAdminMember && (
            <span className="absolute -bottom-1 -right-1 bg-primary-500 text-dark-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              ADMIN
            </span>
          )}
          {isModeratorMember && (
            <span className="absolute -bottom-1 -right-1 bg-purple-500 text-dark-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              MOD
            </span>
          )}
        </div>
        
        <div>
          <p className={`text-sm font-semibold flex items-center gap-1 ${
            theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
          }`}>
            {member.username}{isCurrentUser && <span className={`text-xs font-normal ${
              theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
            }`}>(You)</span>}
          </p>
          <p className={`text-xs truncate max-w-[180px] ${
            theme === 'dark' ? 'text-light-3' : 'text-light-text-3'
          }`}>{member.email}</p>
        </div>
      </div>
      
      {shouldShowGear && (
        <div className="relative">
          <button 
            ref={buttonRef}
            className={`p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 ${
              theme === 'dark'
                ? 'hover:bg-dark-2 text-light-2 hover:text-primary-500'
                : 'hover:bg-light-bg-4 text-light-text-2 hover:text-primary-500'
            }`}
            aria-label="Manage member"
            onClick={handleToggleMenu}
          >
            <MdSettings className={`text-lg ${showRoleMenu ? 'text-primary-500' : ''}`} />
          </button>
          
          <RoleMenu 
            member={member}
            isOpen={showRoleMenu}
            isAdmin={isAdmin}
            isModerator={currentUserRole === 'moderator'}
            onClose={() => setShowRoleMenu(false)}
            groupId={groupId}
          />
        </div>
      )}
    </div>
  );
};

export type { GroupMember };
export default GroupMemberCard; 
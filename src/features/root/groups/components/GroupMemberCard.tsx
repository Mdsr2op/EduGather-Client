import { useState, useRef } from 'react';
import { MdSettings } from 'react-icons/md';
import RoleMenu from './RoleMenu';

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
}

const GroupMemberCard = ({ 
  member, 
  isAdmin = false,
  groupId
}: GroupMemberCardProps) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const isAdminMember = member.role === 'admin';
  const isModeratorMember = member.role === 'moderator';
  
  const handleToggleMenu = () => {
    setShowRoleMenu(prev => !prev);
  };
  
  return (
    <div 
      className="flex items-center justify-between mb-3 p-3 rounded-lg transition-all hover:bg-dark-1/40 border border-transparent hover:border-dark-1"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={member.avatar || 'https://via.placeholder.com/80'}
            alt={`${member.username} Avatar`}
            className={`w-10 h-10 rounded-full object-cover ring-1 ${
              isAdminMember ? 'ring-primary-500' : 
              isModeratorMember ? 'ring-purple-500' : 
              'ring-dark-1'
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
          <p className="text-sm font-semibold text-light-1 flex items-center gap-1">
            {member.username}
          </p>
          <p className="text-xs text-light-3 truncate max-w-[180px]">{member.email}</p>
        </div>
      </div>
      
      {isAdmin && (
        <div className="relative">
          <button 
            ref={buttonRef}
            className="p-2 rounded-full transition-all duration-200 hover:bg-dark-2 text-light-2 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            aria-label="Manage member"
            onClick={handleToggleMenu}
          >
            <MdSettings className={`text-lg ${showRoleMenu ? 'text-primary-500' : ''}`} />
          </button>
          
          <RoleMenu 
            member={member}
            isOpen={showRoleMenu}
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
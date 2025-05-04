import { useRef, useEffect } from 'react';
import { MdAdminPanelSettings, MdPersonRemove, MdSupervisorAccount } from 'react-icons/md';
import type { GroupMember } from './GroupMemberCard';

type MenuItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  isDanger?: boolean;
};

const MenuItem = ({ icon: Icon, label, onClick, isDanger = false }: MenuItemProps) => (
  <button
    className={`w-full text-left px-3 py-2 flex items-center gap-3 text-sm transition-colors hover:bg-dark-1
       ${isDanger ? 'text-red hover:text-red' : 'text-light-1'}`}
    onClick={onClick}
  >
    <Icon className={isDanger ? 'text-red-400' : 'text-light-3'} />
    <span>{label}</span>
  </button>
);

interface RoleMenuProps {
  member: GroupMember;
  isOpen: boolean;
  onClose: () => void;
}

const RoleMenu = ({ member, isOpen, onClose }: RoleMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  return (
    <div 
      ref={menuRef}
      className="absolute right-0 top-full mt-1 bg-dark-2 text-light-1 rounded-xl shadow-lg z-50 border border-dark-4 backdrop-blur-lg overflow-hidden min-w-[180px]"
      style={{ animation: "menuFadeIn 0.15s ease-in-out" }}
    >
      <div className="px-3 py-2 border-b border-dark-4 bg-dark-3">
        <h3 className="text-sm font-medium truncate">Manage {member.username}</h3>
      </div>
      
      <div className="py-1">
        {member.role === 'admin' ? (
          <MenuItem
            icon={MdPersonRemove}
            label="Remove Admin Role"
            onClick={onClose}
          />
        ) : member.role === 'moderator' ? (
          <>
            <MenuItem
              icon={MdAdminPanelSettings}
              label="Make Admin"
              onClick={onClose}
            />
            <MenuItem
              icon={MdPersonRemove}
              label="Remove Moderator Role"
              onClick={onClose}
            />
          </>
        ) : (
          <MenuItem
            icon={MdSupervisorAccount}
            label="Make Moderator"
            onClick={onClose}
          />
        )}
        
        <MenuItem
          icon={MdPersonRemove}
          label="Remove Member"
          onClick={onClose}
          isDanger={true}
        />
      </div>
      
      <style>
        {`
          @keyframes menuFadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default RoleMenu; 
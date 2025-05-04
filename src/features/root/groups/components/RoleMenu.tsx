import { useRef, useEffect, useState } from 'react';
import { MdAdminPanelSettings, MdPersonRemove, MdSupervisorAccount } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import type { GroupMember } from './GroupMemberCard';
import { useAssignRoleMutation, useRemoveUserFromGroupMutation } from '../slices/groupApiSlice';
import { toast } from 'react-hot-toast';
import RemoveConfirmationDialog from './RemoveConfirmationDialog';

type MenuItemProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  isDanger?: boolean;
  isLoading?: boolean;
};

const MenuItem = ({ icon: Icon, label, onClick, isDanger = false, isLoading = false }: MenuItemProps) => (
  <button
    className={`w-full text-left px-3 py-2 flex items-center gap-3 text-sm transition-colors hover:bg-dark-1
       ${isDanger ? 'text-red hover:text-red' : 'text-light-1'}`}
    onClick={onClick}
    disabled={isLoading}
  >
    {isLoading ? (
      <AiOutlineLoading3Quarters className="animate-spin text-light-3" />
    ) : (
      <Icon className={isDanger ? 'text-red-400' : 'text-light-3'} />
    )}
    <span>{label}</span>
  </button>
);

interface RoleMenuProps {
  member: GroupMember;
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

const RoleMenu = ({ member, isOpen, onClose, groupId }: RoleMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [assignRole, { isLoading: isAssigningRole }] = useAssignRoleMutation();
  const [removeUser, { isLoading: isRemovingUser }] = useRemoveUserFromGroupMutation();
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState({
    title: '',
    description: '',
    onConfirm: async () => {},
  });
  
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

  const handleAssignRole = async (role: "member" | "moderator" | "admin") => {
    try {
      await assignRole({ 
        groupId, 
        userId: member._id, 
        role 
      }).unwrap();
      
      toast.success(`${member.username} is now a ${role}`);
      onClose();
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error('Failed to update member role');
    }
  };

  const handleRemoveMember = async () => {
    try {
      await removeUser({
        groupId,
        userId: member._id
      }).unwrap();
      
      toast.success(`${member.username} has been removed from the group`);
      onClose();
      setDialogOpen(false);
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member from group');
    }
  };

  const openRemoveAdminDialog = () => {
    setDialogProps({
      title: "Remove Admin Role",
      description: `Are you sure you want to remove admin privileges from ${member.username}? They will be demoted to a moderator.`,
      onConfirm: () => handleAssignRole('moderator'),
    });
    setDialogOpen(true);
  };

  const openRemoveModeratorDialog = () => {
    setDialogProps({
      title: "Remove Moderator Role",
      description: `Are you sure you want to remove moderator privileges from ${member.username}? They will become a regular member.`,
      onConfirm: () => handleAssignRole('member'),
    });
    setDialogOpen(true);
  };

  const openRemoveMemberDialog = () => {
    setDialogProps({
      title: "Remove Member",
      description: `Are you sure you want to remove ${member.username} from this group? This action cannot be undone.`,
      onConfirm: handleRemoveMember,
    });
    setDialogOpen(true);
  };

  if (!isOpen) return null;
  
  return (
    <>
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
              onClick={openRemoveAdminDialog}
              isLoading={isAssigningRole}
              isDanger={true}
            />
          ) : member.role === 'moderator' ? (
            <>
              <MenuItem
                icon={MdAdminPanelSettings}
                label="Make Admin"
                onClick={() => handleAssignRole('admin')}
                isLoading={isAssigningRole}
              />
              <MenuItem
                icon={MdPersonRemove}
                label="Remove Moderator Role"
                onClick={openRemoveModeratorDialog}
                isLoading={isAssigningRole}
                isDanger={true}
              />
            </>
          ) : (
            <>
              <MenuItem
                icon={MdSupervisorAccount}
                label="Make Moderator"
                onClick={() => handleAssignRole('moderator')}
                isLoading={isAssigningRole}
              />
              <MenuItem
                icon={MdPersonRemove}
                label={`Remove ${member.username}`}
                onClick={openRemoveMemberDialog}
                isDanger={true}
                isLoading={isRemovingUser}
              />
            </>
          )}
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

      <RemoveConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogProps.title}
        description={dialogProps.description}
        username={member.username}
        onConfirm={dialogProps.onConfirm}
        isLoading={isAssigningRole || isRemovingUser}
      />
    </>
  );
};

export default RoleMenu; 
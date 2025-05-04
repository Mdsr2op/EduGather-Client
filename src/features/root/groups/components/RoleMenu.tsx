import { useRef, useEffect, useState } from 'react';
import { MdAdminPanelSettings, MdPersonRemove, MdSupervisorAccount } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import type { GroupMember } from './GroupMemberCard';
import { useAssignRoleMutation, useRemoveUserFromGroupMutation } from '../slices/groupApiSlice';
import { toast } from 'react-hot-toast';
import RemoveUserDialog from './RemoveUserDialog';

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
  isAdmin: boolean;
  isModerator?: boolean;
  onClose: () => void;
  groupId: string;
}


const RoleMenu = ({ member, isOpen, isAdmin, isModerator = false, onClose, groupId }: RoleMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [assignRole, { isLoading: isAssigningRole }] = useAssignRoleMutation();
  const [removeUser, { isLoading: isRemovingUser }] = useRemoveUserFromGroupMutation();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"removeUser" | "removeAdminRole" | "removeModeratorRole">("removeUser");
  const [pendingRole, setPendingRole] = useState<"member" | "moderator" | "admin" | null>(null);
  
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

  const showRemoveRoleDialog = (role: "member" | "moderator" | "admin") => {
    if (role === "moderator" && member.role === "admin") {
      setDialogAction("removeAdminRole");
    } else if (role === "member" && member.role === "moderator") {
      setDialogAction("removeModeratorRole");
    }
    setPendingRole(role);
    setDialogOpen(true);
    onClose(); // Close the menu
  };

  const showRemoveUserDialog = () => {
    setDialogAction("removeUser");
    setDialogOpen(true);
    onClose(); // Close the menu
  };

  const handleAssignRole = async (role: "member" | "moderator" | "admin") => {
    try {
      await assignRole({ 
        groupId, 
        userId: member._id, 
        role 
      }).unwrap();
      
      toast.success(`${member.username} is now a ${role}`);
      onClose();
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
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error('Failed to remove member from group');
    }
  };

  const handleDialogConfirm = async () => {
    if (dialogAction === "removeUser") {
      await handleRemoveMember();
    } else if (pendingRole && (dialogAction === "removeAdminRole" || dialogAction === "removeModeratorRole")) {
      await handleAssignRole(pendingRole);
    }
    setDialogOpen(false);
  };

  if (!isOpen && !dialogOpen) return null;
  
  return (
    <>
      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute right-0 top-full mt-1 bg-dark-2 text-light-1 rounded-xl shadow-lg z-50 border border-dark-4 backdrop-blur-lg overflow-hidden min-w-[180px]"
          style={{ animation: "menuFadeIn 0.15s ease-in-out" }}
        >
          <div className="px-3 py-2 border-b border-dark-4 bg-dark-3">
            <h3 className="text-sm font-medium truncate">Manage {member.username}</h3>
          </div>
          
          <div className="py-1">
            {isAdmin && member.role === 'admin' ? (
              <MenuItem
                icon={MdPersonRemove}
                label="Remove Admin Role"
                onClick={() => showRemoveRoleDialog('moderator')}
                isLoading={isAssigningRole}
                isDanger={true}
              />
            ) : isAdmin && member.role === 'moderator' ? (
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
                  onClick={() => showRemoveRoleDialog('member')}
                  isLoading={isAssigningRole}
                  isDanger={true}
                />
              </>
            ) : isAdmin ? (
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
                  onClick={showRemoveUserDialog}
                  isDanger={true}
                  isLoading={isRemovingUser}
                />
              </>
            ) : isModerator ? (
              <MenuItem
                icon={MdPersonRemove}
                label={`Remove ${member.username}`}
                onClick={showRemoveUserDialog}
                isDanger={true}
                isLoading={isRemovingUser}
              />
            ) : (
              <MenuItem
                icon={MdPersonRemove}
                label={`Remove ${member.username}`}
                onClick={showRemoveUserDialog}
                isDanger={true}
                isLoading={isRemovingUser}
              />
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
      )}

      <RemoveUserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={member}
        onConfirm={handleDialogConfirm}
        isLoading={dialogAction === "removeUser" ? isRemovingUser : isAssigningRole}
        actionType={dialogAction}
      />
    </>
  );
};

export default RoleMenu; 
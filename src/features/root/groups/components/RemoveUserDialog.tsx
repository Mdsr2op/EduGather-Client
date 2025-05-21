import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GroupMember } from "./GroupMemberCard";
import { useTheme } from "@/context/ThemeContext";

interface RemoveUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: GroupMember;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  actionType: "removeUser" | "removeAdminRole" | "removeModeratorRole";
}

const RemoveUserDialog = ({
  open,
  onOpenChange,
  member,
  onConfirm,
  isLoading,
  actionType,
}: RemoveUserDialogProps) => {
  const { theme } = useTheme();
  
  const handleClose = () => {
    onOpenChange(false);
  };

  const getTitleAndDescription = () => {
    switch (actionType) {
      case "removeUser":
        return {
          title: `Remove ${member.username}`,
          description: `Are you sure you want to remove ${member.username} from this group? This action cannot be undone.`
        };
      case "removeAdminRole":
        return {
          title: "Remove Admin Role",
          description: `Are you sure you want to remove admin privileges from ${member.username}? They will be downgraded to moderator.`
        };
      case "removeModeratorRole":
        return {
          title: "Remove Moderator Role",
          description: `Are you sure you want to remove moderator privileges from ${member.username}? They will be downgraded to regular member.`
        };
    }
  };

  const { title, description } = getTitleAndDescription();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-md w-full p-6 rounded-lg shadow-lg border-none ${
        theme === 'dark'
          ? 'bg-dark-4 text-light-1'
          : 'bg-light-bg-1 text-light-text-1'
      }`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className={`text-sm ${
            theme === 'dark' ? 'text-light-4' : 'text-light-text-3'
          }`}>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className={`mt-4 p-4 rounded-xl border ${
          theme === 'dark'
            ? 'bg-dark-3 border-dark-5'
            : 'bg-light-bg-2 border-light-bg-3'
        }`}>
          <div className={`text-sm mb-2 ${
            theme === 'dark' ? 'text-light-2' : 'text-light-text-2'
          }`}>User:</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
              {member.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className={`font-medium ${
                theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
              }`}>{member.username}</div>
              <div className={`text-xs capitalize ${
                theme === 'dark' ? 'text-light-3' : 'text-light-text-3'
              }`}>{member.role}</div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className={`rounded-full ${
                theme === 'dark'
                  ? 'border-dark-5 text-light-1 hover:bg-dark-5'
                  : 'border-light-bg-3 text-light-text-1 hover:bg-light-bg-3'
              }`}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-[#FF4C4C] text-white rounded-full shadow-md hover:bg-[#FF4C4C] hover:opacity-80"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveUserDialog; 
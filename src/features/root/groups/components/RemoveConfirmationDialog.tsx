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

interface RemoveConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  username: string;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

const RemoveConfirmationDialog = ({
  open,
  onOpenChange,
  title,
  description,
  username,
  onConfirm,
  isLoading,
}: RemoveConfirmationDialogProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 bg-dark-3 rounded-xl border border-dark-5">
          <div className="text-sm text-light-2 mb-2">User:</div>
          <div className="text-sm text-light-1 break-words">
            {username}
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-dark-5 text-light-1 hover:bg-dark-5 rounded-full"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-[#FF4C4C] text-white rounded-full shadow-md hover:bg-[#FF4C4C] hover:opacity-80"
            onClick={onConfirm}
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

export default RemoveConfirmationDialog; 
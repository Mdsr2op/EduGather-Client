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
import { MessageType } from "../types/messageTypes";
import { useTheme } from "@/context/ThemeContext";
  
  interface DeleteMessageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    message: MessageType;
    onConfirm: () => Promise<void>;
    isDeleting: boolean;
  }
  
  const DeleteMessageDialog = ({
    open,
    onOpenChange,
    message,
    onConfirm,
    isDeleting,
  }: DeleteMessageDialogProps) => {
    const { theme } = useTheme();
    const handleClose = () => {
      onOpenChange(false);
    };
  
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className={`sm:max-w-md w-full p-6 rounded-lg shadow-lg border-none ${
          theme === 'dark'
            ? 'bg-dark-4 text-light-1'
            : 'bg-light-bg-2 text-light-text-1'
        }`}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Delete Message
            </DialogTitle>
            <DialogDescription className={`text-sm ${
              theme === 'dark' ? 'text-light-4' : 'text-light-text-3'
            }`}>
              Are you sure you want to delete this message? This action cannot be
              undone.
              <br />
              To confirm, type <b>DELETE</b> below:
            </DialogDescription>
          </DialogHeader>
  
          <div className={`mt-4 p-4 rounded-xl border ${
            theme === 'dark'
              ? 'bg-dark-3 border-dark-5'
              : 'bg-light-bg-1 border-light-bg-3'
          }`}>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-light-2' : 'text-light-text-2'
            } mb-2`}>Message Content:</div>
            <div className={`text-sm ${
              theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
            } break-words`}>
              {message.text ||
                (message.attachment
                  ? `File: ${message.attachment.fileName}`
                  : "Message")}
            </div>
            {message.attachment && (
              <div className={`mt-3 pt-2 border-t ${
                theme === 'dark' ? 'border-dark-5' : 'border-light-bg-3'
              }`}>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-light-2' : 'text-light-text-2'
                }`}>Attachment Details:</div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
                } space-y-1`}>
                  <div className="flex items-center gap-2">
                    <span className={theme === 'dark' ? 'text-light-3' : 'text-light-text-3'}>Type:</span>
                    <span>{message.attachment.fileType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={theme === 'dark' ? 'text-light-3' : 'text-light-text-3'}>Size:</span>
                    <span>{(message.attachment.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              </div>
            )}
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
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-[#FF4C4C] text-white rounded-full shadow-md hover:bg-opacity-80"
              onClick={onConfirm}
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete Message"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default DeleteMessageDialog;
  
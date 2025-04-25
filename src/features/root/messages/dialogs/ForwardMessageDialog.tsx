import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForwardMessageMutation } from '../slices/messagesApiSlice';
import { useGetChannelsQuery } from '../../channels/slices/channelApiSlice';
import { MessageType } from '../types/messageTypes';

interface ForwardMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: MessageType;
  groupId: string;
}

const ForwardMessageDialog = ({ 
  open, 
  onOpenChange, 
  message, 
  groupId 
}: ForwardMessageDialogProps) => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const [forwardMessage, { isLoading }] = useForwardMessageMutation();
  const { data: channelsData } = useGetChannelsQuery(groupId, { skip: !groupId });
  
  const channels = channelsData?.data?.channels || [];
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedChannelId('');
      setError(null);
      setSuccess(false);
    }
  }, [open]);
  
  const handleForward = async () => {
    if (!selectedChannelId) {
      setError('Please select a channel');
      return;
    }
    
    try {
      await forwardMessage({
        messageId: message.id,
        data: {
          targetChannelId: selectedChannelId
        }
      }).unwrap();
      
      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      setError('Failed to forward message. Please try again.');
      console.error('Error forwarding message:', err);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-2 text-light-1 border-0 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Forward Message</DialogTitle>
          <DialogDescription className="text-light-2">
            Choose a channel to forward this message to
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <label className="text-sm text-light-2 mb-2 block">Select Channel:</label>
          <select
            value={selectedChannelId}
            onChange={(e) => setSelectedChannelId(e.target.value)}
            className="w-full p-2 rounded-md bg-dark-3 text-light-1 border border-dark-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading || success}
          >
            <option value="" disabled>Select a channel</option>
            {channels.map((channel) => (
              <option key={channel._id} value={channel._id}>
                {channel.channelName}
              </option>
            ))}
          </select>
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">Message forwarded successfully!</p>}
        </div>
        
        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-dark-3 text-light-1 hover:bg-dark-4 border-dark-4"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleForward}
            disabled={isLoading || !selectedChannelId || success}
            className="bg-primary-500 text-light-1 hover:bg-primary-600"
          >
            {isLoading ? 'Forwarding...' : 'Forward'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForwardMessageDialog; 
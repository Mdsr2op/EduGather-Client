import React from 'react';
import { Video, Calendar, Clock, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MeetingAttachmentProps {
  meetingId: string;
  title: string;
  startTime: string;
  endTime?: string;
  isUserMessage: boolean;
  status: 'scheduled' | 'ongoing' | 'ended';
  participantsCount?: number;
}

const MeetingAttachment: React.FC<MeetingAttachmentProps> = ({
  meetingId,
  title,
  startTime,
  endTime,
  isUserMessage,
  status,
  participantsCount = 0
}) => {
  const { groupId, channelId } = useParams();

  const getStatusConfig = () => {
    switch (status) {
      case 'scheduled':
        return { color: 'bg-yellow-500/20 text-yellow-500', icon: <Clock className="w-3 h-3" />, text: 'Scheduled' };
      case 'ongoing':
        return { color: 'bg-green-500/20 text-green-500', icon: <Video className="w-3 h-3" />, text: 'In Progress' };
      case 'ended':
        return { color: 'bg-gray-500/20 text-gray-400', icon: <Clock className="w-3 h-3 opacity-70" />, text: 'Ended' };
      default:
        return { color: 'bg-gray-500/20 text-gray-400', icon: <Clock className="w-3 h-3" />, text: '' };
    }
  };

  const statusConfig = getStatusConfig();
  
  const handleMeetingClick = () => {
    // Don't do anything for ended meetings
    if (status === 'ended') return;
    
    // Open the meeting in a new tab for other statuses
    window.open(`/${groupId}/${channelId}/meeting/${meetingId}`, '_blank');
  };
  
  return (
    <div 
      className={cn(
        "relative w-full sm:w-80 md:w-96 rounded-xl overflow-hidden group mb-1.5 sm:mb-2 mt-0.5 sm:mt-1",
        "transition-all duration-300 shadow-md hover:shadow-lg",
        "bg-dark-4",
        status === 'ended' && "opacity-85",
        isUserMessage && "ml-auto"
      )}
    >
      {/* Status Badge */}
      <div className={cn(
        "absolute top-2 sm:top-3 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-1 sm:gap-1.5",
        statusConfig.color
      )}>
        {statusConfig.icon}
        <span>{statusConfig.text}</span>
      </div>

      {/* Card content */}
      <div className="p-3 sm:p-4 pb-2 sm:pb-3">
        {/* Title with video icon */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <div className="bg-primary-500/20 p-1 sm:p-1.5 rounded-lg">
            <Video className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm truncate pr-12 sm:pr-16">{title}</h3>
        </div>
        
        {/* Meeting details */}
        <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-light-3" />
            <span>{format(new Date(startTime), 'EEE, MMM dd, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-light-3" />
            <span>
              {format(new Date(startTime), 'h:mm a')}
              {endTime && ` - ${format(new Date(endTime), 'h:mm a')}`}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-light-3" />
            <span>{participantsCount} {participantsCount === 1 ? 'participant' : 'participants'}</span>
          </div>
        </div>
        
        {/* Action button */}
        <button 
          onClick={handleMeetingClick}
          className={cn(
            "w-full py-1.5 sm:py-2 mt-0.5 sm:mt-1 rounded-lg flex items-center justify-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            status === 'ended'
              ? "bg-gray-500/10 text-light-3 cursor-default"
              : "bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 focus:ring-primary-500/30 cursor-pointer"
          )}
          disabled={status === 'ended'}
        >
          {status !== 'ended' && <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          {status === 'ongoing' ? 'Join Now' : status === 'ended' ? 'Meeting Ended' : 'Open Meeting'}
        </button>
      </div>
    </div>
  );
};

export default MeetingAttachment;
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
        return { color: 'bg-yellow-500/20 text-yellow-500', icon: <Clock className="w-2.5 h-2.5 xs:w-3 xs:h-3" />, text: 'Scheduled' };
      case 'ongoing':
        return { color: 'bg-green-500/20 text-green-500', icon: <Video className="w-2.5 h-2.5 xs:w-3 xs:h-3" />, text: 'In Progress' };
      case 'ended':
        return { color: 'bg-gray-500/20 text-gray-400', icon: <Clock className="w-2.5 h-2.5 xs:w-3 xs:h-3 opacity-70" />, text: 'Ended' };
      default:
        return { color: 'bg-gray-500/20 text-gray-400', icon: <Clock className="w-2.5 h-2.5 xs:w-3 xs:h-3" />, text: '' };
    }
  };

  const statusConfig = getStatusConfig();
  
  const handleMeetingClick = () => {
    // Don't do anything for ended meetings
    if (status === 'ended') return;
    
    // Open the meeting in a new tab for other statuses
    window.open(`/${groupId}/${channelId}/meeting/${meetingId}`, '_blank');
  };

  // Function to truncate title based on screen size
  const truncateTitle = (text: string) => {
    // Title will be shown with padding-right, and we want to ensure it fits well
    // The actual truncation is handled by CSS, this is just to ensure proper layout
    return text;
  };
  
  return (
    <div 
      className={cn(
        "relative w-full max-w-full xs:max-w-[85%] sm:max-w-[320px] md:max-w-[384px] rounded-xl overflow-hidden group",
        "mb-1 xs:mb-1.5 sm:mb-2 mt-0.5 sm:mt-1",
        "transition-all duration-300 shadow-md hover:shadow-lg",
        "bg-dark-4",
        status === 'ended' && "opacity-85",
        isUserMessage && "ml-auto"
      )}
    >
      {/* Status Badge */}
      <div className={cn(
        "absolute top-1.5 xs:top-2 sm:top-3 right-1.5 xs:right-2 sm:right-3", 
        "px-1 xs:px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] xs:text-[10px] sm:text-xs",
        "font-medium flex items-center gap-0.5 xs:gap-1 sm:gap-1.5",
        statusConfig.color
      )}>
        {statusConfig.icon}
        <span className="line-clamp-1">{statusConfig.text}</span>
      </div>

      {/* Card content */}
      <div className="p-2 xs:p-3 sm:p-4 pb-1.5 xs:pb-2 sm:pb-3">
        {/* Title with video icon */}
        <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 mb-1.5 xs:mb-2 sm:mb-3">
          <div className="bg-primary-500/20 p-0.5 xs:p-1 sm:p-1.5 rounded-md xs:rounded-lg flex-shrink-0">
            <Video className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-primary-500" />
          </div>
          <h3 className="font-bold text-[11px] xs:text-xs sm:text-sm truncate pr-10 xs:pr-12 sm:pr-16" title={title}>
            {truncateTitle(title)}
          </h3>
        </div>
        
        {/* Meeting details */}
        <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 mb-1.5 xs:mb-2 sm:mb-3">
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm">
            <Calendar className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-light-3 flex-shrink-0" />
            <span className="truncate">{format(new Date(startTime), 'EEE, MMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm">
            <Clock className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-light-3 flex-shrink-0" />
            <span className="truncate">
              {format(new Date(startTime), 'h:mm a')}
              {endTime && ` - ${format(new Date(endTime), 'h:mm a')}`}
            </span>
          </div>
          
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm">
            <Users className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-light-3 flex-shrink-0" />
            <span className="truncate">{participantsCount} {participantsCount === 1 ? 'participant' : 'participants'}</span>
          </div>
        </div>
        
        {/* Action button */}
        <button 
          onClick={handleMeetingClick}
          className={cn(
            "w-full py-1 xs:py-1.5 sm:py-2 mt-0.5 rounded-md xs:rounded-lg", 
            "flex items-center justify-center gap-1 xs:gap-1.5",
            "text-[10px] xs:text-xs sm:text-sm font-medium transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.98]",
            "touch-manipulation", // Improved touch handling on mobile
            status === 'ended'
              ? "bg-gray-500/10 text-light-3 cursor-default"
              : "bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 focus:ring-primary-500/30 cursor-pointer"
          )}
          disabled={status === 'ended'}
        >
          {status !== 'ended' && <ExternalLink className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />}
          <span className="truncate">
            {status === 'ongoing' ? 'Join Now' : status === 'ended' ? 'Meeting Ended' : 'Open Meeting'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MeetingAttachment;
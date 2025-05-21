import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { 
  FiUsers, FiBell, FiCalendar, FiClock, FiChevronRight, 
  FiArrowRight, FiMessageSquare 
} from "react-icons/fi";
import { RiTeamLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { NotificationUI } from "@/features/root/notifications/components/NotificationItem";
import { Meeting } from "@/components/pages/ScheduledMeetings";

interface HomeOverviewTabProps {
  joinedGroups: any[];
  upcomingMeetings: Meeting[];
  notifications: NotificationUI[];
  unreadCount: number;
  isLoadingGroups: boolean;
  isLoadingMeetings: boolean;
  isLoadingNotifications: boolean;
}

const HomeOverviewTab = ({
  joinedGroups,
  upcomingMeetings,
  notifications,
  unreadCount,
  isLoadingGroups,
  isLoadingMeetings,
  isLoadingNotifications
}: HomeOverviewTabProps) => {
  const navigate = useNavigate();

  const navigateToGroups = () => {
    navigate("/discover-groups");
  };
  
  const navigateToMeetings = () => {
    navigate("/scheduled-meetings");
  };
  
  const navigateToNotifications = () => {
    navigate("/notifications");
  };
  
  const navigateToGroup = (groupId: string) => {
    navigate(`/${groupId}/channels`);
  };
  
  const navigateToMeeting = (meeting: Meeting) => {
    navigate(`/${meeting.groupId}/${meeting.channelId}/meeting/${meeting.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      {/* Groups Panel */}
      <motion.div className="lg:col-span-1">
        <div className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl overflow-hidden shadow-lg border border-dark-5 dark:border-dark-5 light:border-light-bg-5 h-full">
          <div className="p-4 sm:p-5 border-b border-dark-4 dark:border-dark-4 light:border-light-bg-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <RiTeamLine className="text-primary-500" size={20} />
              <h2 className="text-lg sm:text-xl font-semibold text-light-1 dark:text-light-1 light:text-light-text-1">Your Groups</h2>
            </div>
            <button 
              onClick={navigateToGroups}
              className="text-primary-500 hover:text-primary-400 transition-colors"
              aria-label="View all groups"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
          
          <div className="p-3 sm:p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoadingGroups ? (
              <div className="py-4 flex justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-t-transparent border-primary-500 rounded-full shadow-md"></div>
              </div>
            ) : joinedGroups.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {joinedGroups.slice(0, 4).map((group, index) => (
                    <motion.div 
                      key={group._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group p-3 sm:p-4 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 hover:bg-dark-5 dark:hover:bg-dark-5 light:hover:bg-light-bg-5 rounded-xl cursor-pointer transition-all duration-200"
                      onClick={() => navigateToGroup(group._id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Group Avatar */}
                        {group.avatar ? (
                          <img 
                            src={group.avatar} 
                            alt={group.name} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-dark-3 dark:border-dark-3 light:border-light-bg-3"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary-500/20 text-primary-500 rounded-full flex items-center justify-center border-2 border-dark-3 dark:border-dark-3 light:border-light-bg-3">
                            <FiUsers size={16} />
                          </div>
                        )}
                        
                        {/* Group Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-light-1 dark:text-light-1 light:text-light-text-1 truncate group-hover:text-primary-400 transition-colors">
                            {group.name}
                          </h3>
                          <p className="text-sm text-light-3 dark:text-light-3 light:text-light-text-3 truncate">
                            {group.description}
                          </p>
                        </div>
                        
                        {/* Arrow indicator */}
                        <FiArrowRight className="opacity-0 group-hover:opacity-100 text-primary-500 transition-opacity" />
                      </div>
                      
                      {/* Activity bar */}
                      <div className="mt-3 w-full h-1.5 bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full" 
                          style={{ width: `${Math.floor(Math.random() * 70) + 30}%` }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {joinedGroups.length > 4 && (
                  <button 
                    onClick={() => navigate("/groups")}
                    className="w-full py-2 mt-2 text-sm text-primary-500 hover:text-primary-400 transition-colors"
                  >
                    View all {joinedGroups.length} groups
                  </button>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-light-3 dark:text-light-3 light:text-light-text-3 mb-4">No groups found</p>
                <button 
                  onClick={navigateToGroups}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-light-1 dark:text-light-1 light:text-white rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  <FiUsers size={16} />
                  <span>Join or Create</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Meetings Panel */}
      <motion.div className="lg:col-span-1">
        <div className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl overflow-hidden shadow-lg border border-dark-5 dark:border-dark-5 light:border-light-bg-5 h-full">
          <div className="p-4 sm:p-5 border-b border-dark-4 dark:border-dark-4 light:border-light-bg-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-primary-500" size={20} />
              <h2 className="text-lg sm:text-xl font-semibold text-light-1 dark:text-light-1 light:text-light-text-1">Upcoming Meetings</h2>
            </div>
            <button 
              onClick={navigateToMeetings}
              className="text-primary-500 hover:text-primary-400 transition-colors"
              aria-label="View all meetings"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
          
          <div className="p-3 sm:p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoadingMeetings ? (
              <div className="py-4 flex justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-t-transparent border-primary-500 rounded-full shadow-md"></div>
              </div>
            ) : upcomingMeetings.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {upcomingMeetings.map((meeting, index) => (
                    <motion.div 
                      key={meeting.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group p-3 sm:p-4 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 hover:bg-dark-5 dark:hover:bg-dark-5 light:hover:bg-light-bg-5 rounded-xl cursor-pointer transition-all duration-200"
                      onClick={() => navigateToMeeting(meeting)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Calendar Icon with Date */}
                        <div className="shrink-0 w-12 h-14 flex flex-col items-center justify-center bg-primary-500/20 dark:bg-primary-500/20 light:bg-primary-500/30 rounded-xl border border-primary-500/30 dark:border-primary-500/30 light:border-primary-500/40 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-70 dark:opacity-70 light:opacity-90"></div>
                          <span className="text-xs text-primary-500 font-semibold relative z-10">{meeting.date.split(' ')[0]}</span>
                          <span className="text-lg text-light-1 dark:text-light-1 light:text-light-text-1 font-bold relative z-10">{meeting.date.split(' ')[1]}</span>
                        </div>
                        
                        {/* Meeting Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-light-1 dark:text-light-1 light:text-light-text-1 truncate group-hover:text-primary-400 transition-colors">
                            {meeting.title}
                          </h3>
                          <div className="mt-1 flex items-center text-xs text-light-3 dark:text-light-3 light:text-light-text-3">
                            <FiClock className="mr-1" size={12} />
                            <span>{meeting.time}</span>
                            <div className="mx-2 w-1 h-1 rounded-full bg-light-4 dark:bg-light-4 light:bg-light-text-4"></div>
                            <span className="font-medium text-secondary-400">in {meeting.startingIn}</span>
                          </div>
                          <div className="mt-1.5 flex items-center text-xs">
                            <span className="text-light-3 dark:text-light-3 light:text-light-text-3">in </span>
                            <span className="text-light-2 dark:text-light-2 light:text-light-text-2 ml-1 bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 px-2 py-0.5 rounded-full">{meeting.group}</span>
                          </div>
                        </div>
                        
                        {/* Action indicator */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-primary-500 text-xs text-dark-1 dark:text-dark-1 light:text-white font-medium px-2 py-1 rounded-md whitespace-nowrap">
                            Join Now
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-full flex items-center justify-center">
                  <FiCalendar className="text-light-3 dark:text-light-3 light:text-light-text-3" size={20} />
                </div>
                <p className="text-light-3 dark:text-light-3 light:text-light-text-3 mb-2">No upcoming meetings</p>
                <p className="text-light-4 dark:text-light-4 light:text-light-text-4 text-sm">Schedule a meeting in your group channels</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Notifications Panel */}
      <motion.div className="lg:col-span-1">
        <div className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl overflow-hidden shadow-lg border border-dark-5 dark:border-dark-5 light:border-light-bg-5 h-full">
          <div className="p-4 sm:p-5 border-b border-dark-4 dark:border-dark-4 light:border-light-bg-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FiBell className={`${unreadCount > 0 ? 'text-secondary-500 dark:text-secondary-500 light:text-light-secondary-500' : 'text-primary-500'}`} size={20} />
              <h2 className="text-lg sm:text-xl font-semibold text-light-1 dark:text-light-1 light:text-light-text-1">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs bg-secondary-500 dark:bg-secondary-500 light:bg-light-secondary-500 text-dark-1 dark:text-dark-1 light:text-white px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h2>
            </div>
            <button 
              onClick={navigateToNotifications}
              className="text-primary-500 hover:text-primary-400 transition-colors"
              aria-label="View all notifications"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
          
          <div className="p-3 sm:p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoadingNotifications ? (
              <div className="py-4 flex justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-t-transparent border-primary-500 rounded-full shadow-md"></div>
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {notifications.slice(0, 4).map((notification: NotificationUI, index) => {
                    const getTypeColor = () => {
                      switch (notification.type) {
                        case 'channel_message': return 'bg-blue-600 dark:bg-blue-600 light:bg-blue-600';
                        case 'meeting_created': return 'bg-green-600 dark:bg-green-600 light:bg-green-600';
                        case 'role_upgrade_requested': return 'bg-purple-600 dark:bg-purple-600 light:bg-purple-600';
                        default: return 'bg-gray-600 dark:bg-gray-600 light:bg-gray-600';
                      }
                    };
                    
                    const getTypeIcon = () => {
                      switch (notification.type) {
                        case 'channel_message': return <FiMessageSquare size={16} />;
                        case 'meeting_created': return <FiCalendar size={16} />;
                        case 'role_upgrade_requested': return <FiUsers size={16} />;
                        default: return <FiBell size={16} />;
                      }
                    };
                    
                    return (
                      <motion.div 
                        key={notification._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`group p-3 sm:p-4 ${notification.isRead 
                          ? 'bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4' 
                          : 'bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 border-l-2 border-secondary-500 dark:border-secondary-500 light:border-light-secondary-500'
                        } hover:bg-dark-5 dark:hover:bg-dark-5 light:hover:bg-light-bg-5 rounded-xl cursor-pointer transition-all duration-200`}
                        onClick={() => navigateToNotifications()}
                      >
                        <div className="flex gap-3">
                          {/* Notification Icon */}
                          <div className={`shrink-0 w-8 h-8 flex items-center justify-center ${getTypeColor()} rounded-full text-white`}>
                            {getTypeIcon()}
                          </div>
                          
                          {/* Notification Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium ${notification.isRead 
                              ? 'text-light-2 dark:text-light-2 light:text-light-text-2' 
                              : 'text-light-1 dark:text-light-1 light:text-light-text-1'
                            } truncate`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-light-3 dark:text-light-3 light:text-light-text-3 truncate">{notification.message}</p>
                            <div className="mt-1.5 flex items-center text-xs text-light-4 dark:text-light-4 light:text-light-text-4">
                              <FiClock className="mr-1" size={10} />
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                          
                          {/* Unread indicator */}
                          {!notification.isRead && (
                            <div className="relative w-2 h-2 shrink-0 mt-2">
                              <div className="absolute inset-0 bg-secondary-500 dark:bg-secondary-500 light:bg-light-secondary-500 rounded-full"></div>
                              <motion.div 
                                className="absolute -inset-1 bg-secondary-500/50 dark:bg-secondary-500/50 light:bg-light-secondary-500/50 rounded-full"
                                animate={{
                                  scale: [0.8, 1.5, 0.8],
                                  opacity: [0.7, 0, 0.7]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {notifications.length > 4 && (
                  <button 
                    onClick={() => navigate("/notifications")}
                    className="w-full py-2 mt-2 text-sm text-primary-500 hover:text-primary-400 transition-colors"
                  >
                    View all {notifications.length} notifications
                  </button>
                )}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-full flex items-center justify-center">
                  <FiBell className="text-light-3 dark:text-light-3 light:text-light-text-3" size={20} />
                </div>
                <p className="text-light-3 dark:text-light-3 light:text-light-text-3">No notifications yet</p>
                <p className="text-light-4 dark:text-light-4 light:text-light-text-4 text-sm mt-1">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomeOverviewTab; 
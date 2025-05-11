import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FiUsers, FiBell, FiCalendar, FiClock, FiActivity, FiPlus, FiChevronRight, FiArrowRight, FiSearch } from "react-icons/fi";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";
import { useGetJoinedGroupsQuery } from "@/features/root/groups/slices/groupApiSlice";
import { useGetNotificationsQuery } from "@/features/root/notifications";
import { NotificationUI } from "@/features/root/notifications/components/NotificationItem";
import { useGetCalls, ExtendedCall } from "@/hooks/useGetCalls";
import { Meeting } from "@/components/pages/ScheduledMeetings";

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Get joined groups
  const { data: joinedGroups = [], isLoading: isLoadingGroups } = useGetJoinedGroupsQuery(
    user?._id ?? "", 
    { skip: !user?._id }
  );
  
  // Get notifications
  const { data: notificationsData, isLoading: isLoadingNotifications } = useGetNotificationsQuery(
    {}, 
    { skip: !user?._id }
  );
  
  // Get upcoming meetings
  const { calls, isLoading: isLoadingMeetings } = useGetCalls({
    status: 'scheduled',
    limit: 5,
    sortDirection: 1, // ascending by start time
    userId: user?._id
  });
  
  // Convert Stream calls to meeting format
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  
  useEffect(() => {
    if (calls && calls.length > 0) {
      const convertedMeetings = calls.map((call: ExtendedCall) => {
        const startTime = call.state.startsAt ? new Date(call.state.startsAt) : null;
        const createdBy = call.state.createdBy?.name || "Unknown";
        const custom = call.state.custom || {};
        
        return {
          id: call.id,
          title: custom.description || "Untitled Meeting",
          date: startTime ? formatDateString(startTime) : "TBD",
          time: startTime ? formatTimeString(startTime) : "TBD",
          organizer: createdBy || "Unknown",
          channel: custom.channelName || "General",
          agenda: custom.agenda || "No agenda provided",
          startingIn: formatMeetingTime(startTime),
          group: custom.groupName || "Unknown",
          groupId: custom.groupId || "",
          channelId: custom.channelId || ""
        };
      });
      
      setUpcomingMeetings(convertedMeetings);
    }
  }, [calls]);
  
  // Helper functions for date and time formatting
  const formatDateString = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatTimeString = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const formatMeetingTime = (startTime: Date | null): string => {
    if (!startTime) return "N/A";
    
    const now = new Date();
    const diffMs = startTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return "Starting now";
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    if (diffHours > 0) return `about ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    return "less than a minute";
  };
  
  // Navigation functions
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
  
  // Extract the notifications
  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = notifications.filter((n: NotificationUI) => !n.isRead).length;
  
  // Get filtered groups based on search query
  const filteredGroups = searchQuery ? 
    joinedGroups.filter(group => 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) : 
    joinedGroups;
  
  return (
    <div className="p-3 sm:p-6 bg-dark-2 text-light-1 h-full overflow-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Greeting */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-10"
        >
          <div className="relative rounded-2xl bg-gradient-to-br from-dark-4 to-dark-3 p-6 sm:p-8 overflow-hidden">
            {/* Animated background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <motion.div 
                className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-500/10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.2, 0.3]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
              <motion.div 
                className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-secondary-500/10"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.1, 0.2]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
            </div>
            
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-light-1 to-light-2 text-transparent bg-clip-text">
                Welcome back, {user?.username || 'Scholar'}
              </h1>
              <p className="text-light-3 text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">
                Your educational hub for collaboration and learning
              </p>
              
              <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base">
                <div className="bg-dark-3 rounded-xl p-3 sm:p-4 flex items-center gap-2 border border-dark-5">
                  <div className="p-2 bg-dark-4 rounded-full">
                    <FiUsers className="text-primary-500" size={18} />
                  </div>
                  <div>
                    <div className="text-light-3">Your Groups</div>
                    <div className="font-semibold text-light-1">{joinedGroups.length || 0}</div>
                  </div>
                </div>
                
                <div className="bg-dark-3 rounded-xl p-3 sm:p-4 flex items-center gap-2 border border-dark-5">
                  <div className="p-2 bg-dark-4 rounded-full">
                    <FiBell className={unreadCount > 0 ? "text-secondary-500" : "text-light-3"} size={18} />
                  </div>
                  <div>
                    <div className="text-light-3">Notifications</div>
                    <div className="font-semibold text-light-1">{unreadCount} unread</div>
                  </div>
                </div>
                
                <div className="bg-dark-3 rounded-xl p-3 sm:p-4 flex items-center gap-2 border border-dark-5">
                  <div className="p-2 bg-dark-4 rounded-full">
                    <FiCalendar className="text-primary-500" size={18} />
                  </div>
                  <div>
                    <div className="text-light-3">Upcoming Meetings</div>
                    <div className="font-semibold text-light-1">{upcomingMeetings.length || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Search & Quick Actions Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <div className={`relative rounded-xl bg-dark-3 p-2 sm:p-4 border ${isSearchFocused ? 'border-primary-500' : 'border-dark-4'} transition-all duration-300`}>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-3" />
                <input 
                  type="text"
                  placeholder="Search your groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full bg-dark-4 border-none rounded-lg py-2 pl-10 pr-4 text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button 
                onClick={navigateToGroups}
                className="hidden sm:flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-light-1 px-4 py-2 rounded-lg transition-colors"
              >
                <FiPlus size={16} />
                <span>New Group</span>
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column: Your Groups */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-dark-3 rounded-xl overflow-hidden shadow-lg border border-dark-5 h-full">
              <div className="p-4 sm:p-5 border-b border-dark-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FiUsers className="text-primary-500" size={20} />
                  <h2 className="text-lg sm:text-xl font-semibold">Your Groups</h2>
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
                    <div className="animate-spin h-6 w-6 border-2 border-t-transparent border-primary-500 rounded-full"></div>
                  </div>
                ) : filteredGroups.length > 0 ? (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {filteredGroups.map((group, index) => (
                        <motion.div 
                          key={group._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="group p-3 sm:p-4 bg-dark-4 hover:bg-dark-5 rounded-lg cursor-pointer transition-all duration-200"
                          onClick={() => navigateToGroup(group._id)}
                        >
                          <div className="flex items-start gap-3">
                            {/* Group Avatar */}
                            {group.avatar ? (
                              <img 
                                src={group.avatar} 
                                alt={group.name} 
                                className="w-10 h-10 rounded-full object-cover border-2 border-dark-3"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-primary-500/20 text-primary-500 rounded-full flex items-center justify-center border-2 border-dark-3">
                                <FiUsers size={16} />
                              </div>
                            )}
                            
                            {/* Group Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-light-1 truncate group-hover:text-primary-400 transition-colors">
                                {group.name}
                              </h3>
                              <p className="text-sm text-light-3 truncate">
                                {group.description}
                              </p>
                            </div>
                            
                            {/* Arrow indicator */}
                            <FiArrowRight className="opacity-0 group-hover:opacity-100 text-primary-500 transition-opacity" />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-light-3 mb-4">No groups found</p>
                    <button 
                      onClick={navigateToGroups}
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-light-1 rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      <FiPlus size={16} />
                      <span>Join or Create</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Middle Column: Upcoming Meetings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="bg-dark-3 rounded-xl overflow-hidden shadow-lg border border-dark-5 h-full">
              <div className="p-4 sm:p-5 border-b border-dark-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-primary-500" size={20} />
                  <h2 className="text-lg sm:text-xl font-semibold">Upcoming Meetings</h2>
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
                    <div className="animate-spin h-6 w-6 border-2 border-t-transparent border-primary-500 rounded-full"></div>
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
                          className="group p-3 sm:p-4 bg-dark-4 hover:bg-dark-5 rounded-lg cursor-pointer transition-all duration-200"
                          onClick={() => navigateToMeeting(meeting)}
                        >
                          <div className="flex items-start gap-3">
                            {/* Calendar Icon with Date */}
                            <div className="shrink-0 w-12 h-14 flex flex-col items-center justify-center bg-primary-500/20 rounded-lg border border-primary-500/30">
                              <span className="text-xs text-primary-500 font-semibold">{meeting.date.split(' ')[0]}</span>
                              <span className="text-lg text-light-1 font-bold">{meeting.date.split(' ')[1]}</span>
                            </div>
                            
                            {/* Meeting Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-light-1 truncate group-hover:text-primary-400 transition-colors">
                                {meeting.title}
                              </h3>
                              <div className="mt-1 flex items-center text-xs text-light-3">
                                <FiClock className="mr-1" size={12} />
                                <span>{meeting.time}</span>
                                <span className="mx-2">•</span>
                                <span>Starting in {meeting.startingIn}</span>
                              </div>
                              <div className="mt-1 text-xs">
                                <span className="text-light-3">Group: </span>
                                <span className="text-light-2">{meeting.group}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-light-3 mb-2">No upcoming meetings</p>
                    <p className="text-light-4 text-sm">Schedule a meeting in your group channels</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Right Column: Notifications */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-dark-3 rounded-xl overflow-hidden shadow-lg border border-dark-5 h-full">
              <div className="p-4 sm:p-5 border-b border-dark-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FiBell className={`${unreadCount > 0 ? 'text-secondary-500' : 'text-primary-500'}`} size={20} />
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 text-xs bg-secondary-500 text-dark-1 px-2 py-0.5 rounded-full">
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
                    <div className="animate-spin h-6 w-6 border-2 border-t-transparent border-primary-500 rounded-full"></div>
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {notifications.slice(0, 5).map((notification: NotificationUI, index) => {
                        const getTypeColor = () => {
                          switch (notification.type) {
                            case 'channel_message': return 'bg-blue-600';
                            case 'meeting_created': return 'bg-green-600';
                            case 'role_upgrade_requested': return 'bg-purple-600';
                            default: return 'bg-gray-600';
                          }
                        };
                        
                        const getTypeIcon = () => {
                          switch (notification.type) {
                            case 'channel_message': return <FiUsers size={16} />;
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
                            className={`group p-3 sm:p-4 ${notification.isRead ? 'bg-dark-4' : 'bg-dark-5 border-l-4 border-secondary-500'} hover:bg-dark-5 rounded-lg cursor-pointer transition-all duration-200`}
                            onClick={() => navigateToNotifications()}
                          >
                            <div className="flex gap-3">
                              {/* Notification Icon */}
                              <div className={`shrink-0 w-8 h-8 flex items-center justify-center ${getTypeColor()} rounded-full text-white`}>
                                {getTypeIcon()}
                              </div>
                              
                              {/* Notification Content */}
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-medium ${notification.isRead ? 'text-light-2' : 'text-light-1'} truncate`}>
                                  {notification.title}
                                </h3>
                                <p className="text-sm text-light-3 truncate">{notification.message}</p>
                                <div className="mt-1 text-xs text-light-4">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-light-3">No notifications yet</p>
                    <p className="text-light-4 text-sm mt-1">You're all caught up!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-6 sm:mt-8"
        >
          <div className="bg-dark-3 rounded-xl overflow-hidden shadow-lg border border-dark-5">
            <div className="p-4 sm:p-5 border-b border-dark-4 flex items-center gap-2">
              <FiActivity className="text-primary-500" size={20} />
              <h2 className="text-lg sm:text-xl font-semibold">Recent Activity</h2>
            </div>
            
            {/* Cool animated illustration for activity summary */}
            <div className="p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-10">
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-light-1 mb-3">Your Learning Journey</h3>
                <p className="text-light-3 mb-4 max-w-xl">
                  Track your progress, engagement, and collaboration across all your educational groups.
                </p>
                <button 
                  onClick={navigateToGroups}
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-light-1 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
                >
                  <span>Explore More Groups</span>
                  <FiArrowRight />
                </button>
              </div>
              
              {/* Interactive activity visualization */}
              <div className="w-full max-w-sm lg:flex-1">
                <div className="relative h-60 sm:h-72 w-full bg-dark-4 rounded-xl overflow-hidden">
                  {/* Animated activity graph */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(85, 112, 241, 0.8)" />
                        <stop offset="100%" stopColor="rgba(85, 112, 241, 0)" />
                      </linearGradient>
                    </defs>
                    
                    {/* Activity area */}
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                      d="M0,50 C10,35 20,40 30,30 C40,20 50,35 60,25 C70,15 80,20 90,10 L90,50 L0,50 Z"
                      fill="url(#gradient)"
                      stroke="rgba(85, 112, 241, 1)"
                      strokeWidth="0.5"
                    />
                    
                    {/* Activity line */}
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.5 }}
                      d="M0,50 C10,35 20,40 30,30 C40,20 50,35 60,25 C70,15 80,20 90,10"
                      fill="none"
                      stroke="rgba(85, 112, 241, 1)"
                      strokeWidth="1.5"
                    />
                    
                    {/* Activity points */}
                    {[
                      { x: 10, y: 35 },
                      { x: 30, y: 30 },
                      { x: 50, y: 35 },
                      { x: 60, y: 25 },
                      { x: 90, y: 10 },
                    ].map((point, index) => (
                      <motion.circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="2"
                        fill="#fff"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.2 }}
                      />
                    ))}
                  </svg>
                  
                  {/* Activity metrics */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <div className="bg-dark-2/80 backdrop-blur-sm p-2 rounded-lg text-xs">
                      <span className="text-light-3">Groups</span>
                      <div className="text-primary-500 font-bold">{joinedGroups.length}</div>
                    </div>
                    <div className="bg-dark-2/80 backdrop-blur-sm p-2 rounded-lg text-xs">
                      <span className="text-light-3">Meetings</span>
                      <div className="text-primary-500 font-bold">{upcomingMeetings.length}</div>
                    </div>
                    <div className="bg-dark-2/80 backdrop-blur-sm p-2 rounded-lg text-xs">
                      <span className="text-light-3">Notifications</span>
                      <div className="text-primary-500 font-bold">{notifications.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

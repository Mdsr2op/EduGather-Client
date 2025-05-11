import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll, useInView } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FiUsers, FiBell, FiCalendar, FiClock, FiActivity, FiPlus, FiChevronRight, 
         FiArrowRight, FiSearch, FiBook, FiMessageSquare, FiMail, FiStar, 
         FiTrendingUp, FiAward, FiCheckCircle, FiGlobe, FiSettings, FiUser, FiHome } from "react-icons/fi";
import { RiRocketLine, RiChatSmile3Line, RiTeamLine, RiGroupLine } from "react-icons/ri";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";
import { useGetJoinedGroupsQuery } from "@/features/root/groups/slices/groupApiSlice";
import { useGetNotificationsQuery } from "@/features/root/notifications";
import { NotificationUI } from "@/features/root/notifications/components/NotificationItem";
import { useGetCalls, ExtendedCall } from "@/hooks/useGetCalls";
import { Meeting } from "@/components/pages/ScheduledMeetings";
import { cn } from "@/lib/utils";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef);
  const { scrollYProgress } = useScroll();
  
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
  const [activeTab, setActiveTab] = useState("overview");
  
  // Extract notifications and stats
  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = notifications.filter((n: NotificationUI) => !n.isRead).length;
  
  // Get filtered groups based on search query
  const filteredGroups = searchQuery ? 
    joinedGroups.filter(group => 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) : 
    joinedGroups;
  
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
  
  return (
    <div className="p-3 sm:p-6 bg-dark-2 text-light-1 h-full overflow-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Greeting */}
        <motion.div 
          ref={heroRef}
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-10"
        >
          <div className="relative rounded-2xl bg-gradient-to-br from-primary-500/20 via-dark-3 to-dark-4 p-6 sm:p-8 overflow-hidden">
            {/* Dynamic animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              {/* Animated floating orbs */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute rounded-full ${
                    i % 2 === 0 ? 'bg-primary-500/10' : 'bg-secondary-500/10'
                  }`}
                  style={{
                    width: `${Math.random() * 100 + 50}px`,
                    height: `${Math.random() * 100 + 50}px`,
                    top: `${Math.random() * 80}%`,
                    left: `${Math.random() * 80}%`,
                    zIndex: 1
                  }}
                  animate={{
                    y: [0, Math.random() * 30 - 15],
                    x: [0, Math.random() * 30 - 15],
                    scale: [1, Math.random() * 0.3 + 0.9],
                    opacity: [0.2, 0.5, 0.3] // Start dim, get brighter, then slightly dim
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: Math.random() * 5 + 5
                  }}
                />
              ))}
              
              {/* Light beams with enhanced brightness */}
              <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-500/30 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-secondary-500/30 to-transparent rounded-full blur-3xl"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {user?.avatar ? (
                    <div className="relative">
                      <img 
                        src={user.avatar} 
                        alt={user.username || 'User avatar'} 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-primary-500/50"
                      />
                      <motion.div 
                        className="absolute -inset-1 rounded-xl z-[-1] bg-gradient-to-r from-primary-500 to-secondary-500 opacity-70 blur-sm"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.5, 0.7, 0.5]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: 'reverse'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-dark-4 text-primary-500">
                      <FiUser size={32} />
                      <motion.div 
                        className="absolute -inset-1 rounded-xl z-[-1] bg-gradient-to-r from-primary-500 to-secondary-500 opacity-70 blur-sm"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          opacity: [0.5, 0.7, 0.5]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: 'reverse'
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Online status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-dark-3 rounded-full" />
                </motion.div>
                
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 bg-gradient-to-r from-primary-400 via-light-1 to-secondary-400 text-transparent bg-clip-text animate-gradient">
                      Welcome back, {user?.username || 'Scholar'}
                    </h1>
                    <p className="text-light-2 text-base sm:text-xl">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </motion.div>
                </div>
              </div>
              
              <style>{`
                @keyframes gradient {
                  0% {
                    background-position: 0% 50%;
                  }
                  50% {
                    background-position: 100% 50%;
                  }
                  100% {
                    background-position: 0% 50%;
                  }
                }
                
                .animate-gradient {
                  background-size: 200% 200%;
                  animation: gradient 6s ease infinite;
                }
              `}</style>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6"
              >
                <motion.div 
                  variants={itemVariants}
                  className="bg-dark-4/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-dark-5 hover:border-primary-500/50 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigateToGroups()}
                >
                  <div className="p-2 bg-primary-500/20 rounded-xl group-hover:bg-primary-500/30 transition-colors">
                    <RiTeamLine className="text-primary-500" size={24} />
                  </div>
                  <div>
                    <div className="text-light-3 text-xs sm:text-sm">Active Groups</div>
                    <div className="font-semibold text-light-1 text-base sm:text-lg">{joinedGroups.length || 0}</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="bg-dark-4/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-dark-5 hover:border-secondary-500/50 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigateToNotifications()}
                >
                  <div className="p-2 bg-secondary-500/20 rounded-xl group-hover:bg-secondary-500/30 transition-colors">
                    <FiBell className={unreadCount > 0 ? "text-secondary-500" : "text-light-3"} size={24} />
                  </div>
                  <div>
                    <div className="text-light-3 text-xs sm:text-sm">Notifications</div>
                    <div className="font-semibold text-light-1 text-base sm:text-lg flex items-center gap-2">
                      {unreadCount > 0 ? (
                        <>
                          <span>{unreadCount}</span>
                          <span className="text-xs px-2 py-0.5 bg-secondary-500/20 text-secondary-500 rounded-full">New</span>
                        </>
                      ) : (
                        <span>All caught up</span>
                      )}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="bg-dark-4/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-dark-5 hover:border-primary-500/50 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigateToMeetings()}
                >
                  <div className="p-2 bg-primary-500/20 rounded-xl group-hover:bg-primary-500/30 transition-colors">
                    <FiCalendar className="text-primary-500" size={24} />
                  </div>
                  <div>
                    <div className="text-light-3 text-xs sm:text-sm">Upcoming Meetings</div>
                    <div className="font-semibold text-light-1 text-base sm:text-lg">{upcomingMeetings.length || 0}</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className="bg-dark-4/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-dark-5 hover:border-secondary-500/50 transition-colors group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 bg-secondary-500/20 rounded-xl group-hover:bg-secondary-500/30 transition-colors">
                    <FiActivity className="text-secondary-500" size={24} />
                  </div>
                  <div>
                    <div className="text-light-3 text-xs sm:text-sm">Activity Score</div>
                    <div className="font-semibold text-light-1 text-base sm:text-lg">
                      <div className="flex items-center">
                        <span>{Math.floor(Math.random() * 500) + 500}</span>
                        <FiTrendingUp className="ml-1 text-green-500" size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
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
          <div className={`relative rounded-xl bg-dark-3 p-3 sm:p-5 border ${isSearchFocused ? 'border-primary-500 shadow-[0_0_15px_rgba(85,112,241,0.15)]' : 'border-dark-4'} transition-all duration-300`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="relative flex-grow w-full">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-3">
                  <FiSearch size={18} className={`transition-all duration-300 ${isSearchFocused ? 'text-primary-500' : 'text-light-3'}`} />
                </div>
                <input 
                  type="text"
                  placeholder="Search groups, meetings, or messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full bg-dark-4 border-none rounded-xl py-3 pl-10 pr-4 text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-3 hover:text-light-1 transition-colors"
                    onClick={() => setSearchQuery("")}
                  >
                    ×
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={navigateToGroups}
                  className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-light-1 px-4 py-3 rounded-xl transition-colors flex-1 sm:flex-initial"
                >
                  <FiUsers size={18} />
                  <span>Discover Groups</span>
                </button>
                
              </div>
            </div>
            
            {searchQuery && filteredGroups.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-dark-3 border border-dark-4 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
                <div className="p-2">
                  <h4 className="text-xs text-light-3 uppercase font-semibold mb-2 px-2">Search Results</h4>
                  {filteredGroups.map(group => (
                    <div 
                      key={group._id}
                      className="flex items-center gap-3 p-2 hover:bg-dark-4 rounded-md cursor-pointer"
                      onClick={() => {
                        navigateToGroup(group._id);
                        setSearchQuery("");
                      }}
                    >
                      {group.avatar ? (
                        <img src={group.avatar} alt={group.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                          <FiUsers className="text-primary-500" size={14} />
                        </div>
                      )}
                      <div>
                        <div className="text-light-1 font-medium text-sm">{group.name}</div>
                        <div className="text-light-3 text-xs truncate">{group.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-6"
        >
          <div className="bg-dark-3 rounded-xl p-1.5 flex items-center">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-1 w-full">
              {[
                { id: "overview", label: "Overview", icon: <FiHome size={16} /> },
                { id: "groups", label: "My Groups", icon: <FiUsers size={16} /> },
                { id: "meetings", label: "Meetings", icon: <FiCalendar size={16} /> },
                { id: "resources", label: "Resources", icon: <FiBook size={16} /> },
                { id: "notifications", label: "Alerts", icon: <FiBell size={16} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={cn(
                    "flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-primary-500 text-light-1 shadow-md"
                      : "bg-transparent text-light-3 hover:bg-dark-4 hover:text-light-2"
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="hidden md:block">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.id === "notifications" && unreadCount > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 bg-secondary-500 text-dark-1 text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Main Content Based on Selected Tab */}
        <div className="mb-6">
          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {/* Groups Panel */}
              <motion.div className="lg:col-span-1">
                <div className="bg-dark-3 rounded-xl overflow-hidden shadow-lg border border-dark-5 h-full">
                  <div className="p-4 sm:p-5 border-b border-dark-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <RiTeamLine className="text-primary-500" size={20} />
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
                          {filteredGroups.slice(0, 4).map((group, index) => (
                            <motion.div 
                              key={group._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className="group p-3 sm:p-4 bg-dark-4 hover:bg-dark-5 rounded-xl cursor-pointer transition-all duration-200"
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
                              
                              {/* Activity bar - just decorative */}
                              <div className="mt-3 w-full h-1.5 bg-dark-3 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full" 
                                  style={{ width: `${Math.floor(Math.random() * 70) + 30}%` }}
                                ></div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        
                        {filteredGroups.length > 4 && (
                          <button 
                            onClick={() => setActiveTab("groups")}
                            className="w-full py-2 mt-2 text-sm text-primary-500 hover:text-primary-400 transition-colors"
                          >
                            View all {filteredGroups.length} groups
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-light-3 mb-4">No groups found</p>
                        <button 
                          onClick={navigateToGroups}
                          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-light-1 rounded-xl transition-colors inline-flex items-center gap-2"
                        >
                          <FiPlus size={16} />
                          <span>Join or Create</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* Meetings Panel */}
              <motion.div className="lg:col-span-1">
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
                              className="group p-3 sm:p-4 bg-dark-4 hover:bg-dark-5 rounded-xl cursor-pointer transition-all duration-200"
                              onClick={() => navigateToMeeting(meeting)}
                            >
                              <div className="flex items-start gap-3">
                                {/* Calendar Icon with Date */}
                                <div className="shrink-0 w-12 h-14 flex flex-col items-center justify-center bg-primary-500/20 rounded-xl border border-primary-500/30">
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
                                    <div className="mx-2 w-1 h-1 rounded-full bg-light-4"></div>
                                    <span className="font-medium text-secondary-400">in {meeting.startingIn}</span>
                                  </div>
                                  <div className="mt-1.5 flex items-center text-xs">
                                    <span className="text-light-3">in </span>
                                    <span className="text-light-2 ml-1 bg-dark-3 px-2 py-0.5 rounded-full">{meeting.group}</span>
                                  </div>
                                </div>
                                
                                {/* Action indicator */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="bg-primary-500 text-xs text-dark-1 font-medium px-2 py-1 rounded-md whitespace-nowrap">
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
                        <div className="w-12 h-12 mx-auto mb-3 bg-dark-4 rounded-full flex items-center justify-center">
                          <FiCalendar className="text-light-3" size={20} />
                        </div>
                        <p className="text-light-3 mb-2">No upcoming meetings</p>
                        <p className="text-light-4 text-sm">Schedule a meeting in your group channels</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* Notifications Panel */}
              <motion.div className="lg:col-span-1">
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
                          {notifications.slice(0, 4).map((notification: NotificationUI, index) => {
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
                                className={`group p-3 sm:p-4 ${notification.isRead ? 'bg-dark-4' : 'bg-dark-4 border-l-2 border-secondary-500'} hover:bg-dark-5 rounded-xl cursor-pointer transition-all duration-200`}
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
                                    <div className="mt-1.5 flex items-center text-xs text-light-4">
                                      <FiClock className="mr-1" size={10} />
                                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </div>
                                  </div>
                                  
                                  {/* Unread indicator */}
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-secondary-500 rounded-full shrink-0 mt-2"></div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                        
                        {notifications.length > 4 && (
                          <button 
                            onClick={() => setActiveTab("notifications")}
                            className="w-full py-2 mt-2 text-sm text-primary-500 hover:text-primary-400 transition-colors"
                          >
                            View all {notifications.length} notifications
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="py-16 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-dark-4 rounded-full flex items-center justify-center">
                          <FiBell className="text-light-3" size={20} />
                        </div>
                        <p className="text-light-3">No notifications yet</p>
                        <p className="text-light-4 text-sm mt-1">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          {/* Groups Tab Content */}
          {activeTab === "groups" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-dark-3 rounded-xl p-5 shadow-lg border border-dark-5"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-light-1 flex items-center gap-2">
                    <RiTeamLine className="text-primary-500" />
                    Your Study Groups
                  </h2>
                  <p className="text-light-3 text-sm sm:text-base mt-1">
                    Manage and navigate through all your educational groups
                  </p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={navigateToGroups}
                    className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-light-1 px-4 py-2 rounded-xl transition-colors flex-1 sm:flex-initial"
                  >
                    <FiPlus size={16} />
                    <span>Join Group</span>
                  </button>
                  
                  <button
                    className="flex items-center justify-center gap-2 bg-dark-4 hover:bg-dark-5 text-light-1 px-4 py-2 rounded-xl transition-colors flex-1 sm:flex-initial"
                  >
                    <FiSettings size={16} />
                    <span>Manage</span>
                  </button>
                </div>
              </div>
              
              {isLoadingGroups ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin h-10 w-10 border-3 border-primary-500 border-t-transparent rounded-full"></div>
                </div>
              ) : filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {filteredGroups.map((group, index) => (
                      <motion.div
                        key={group._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group bg-dark-4 hover:bg-dark-5 rounded-xl p-5 cursor-pointer border border-dark-5 hover:border-primary-500/30 transition-all duration-300 flex flex-col h-full"
                        onClick={() => navigateToGroup(group._id)}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          {group.avatar ? (
                            <img
                              src={group.avatar}
                              alt={group.name}
                              className="w-14 h-14 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-500/20 to-primary-500/10 rounded-xl flex items-center justify-center">
                              <FiUsers className="text-primary-500" size={24} />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-light-1 truncate group-hover:text-primary-400 transition-colors">
                              {group.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-primary-500/10 text-primary-500 text-xs rounded-full">
                                Active
                              </span>
                              <span className="text-light-3 text-xs">
                                {new Date(group.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-light-3 text-sm line-clamp-2 mb-4 flex-grow">
                          {group.description}
                        </p>
                        
                        <div className="mt-auto">
                          {/* Activity bar */}
                          <div className="flex justify-between items-center text-xs text-light-3 mb-2">
                            <span>Activity</span>
                            <span className="text-primary-400">
                              {Math.floor(Math.random() * 70) + 30}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-dark-3 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                              style={{ width: `${Math.floor(Math.random() * 70) + 30}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-dark-4 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUsers className="text-light-3" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-light-1 mb-2">No Groups Found</h3>
                  <p className="text-light-3 mb-6 max-w-md mx-auto">
                    You haven't joined any study groups yet. Join a group to collaborate with others.
                  </p>
                  <button
                    onClick={navigateToGroups}
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-light-1 rounded-xl transition-colors inline-flex items-center gap-2"
                  >
                    <FiPlus size={18} />
                    <span>Join or Create Group</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Meetings Tab Content */}
          {activeTab === "meetings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-dark-3 rounded-xl p-5 shadow-lg border border-dark-5"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-light-1 flex items-center gap-2">
                    <FiCalendar className="text-primary-500" />
                    Meetings Calendar
                  </h2>
                  <p className="text-light-3 text-sm sm:text-base mt-1">
                    View and manage all your upcoming meetings and sessions
                  </p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={navigateToMeetings}
                    className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-light-1 px-4 py-2 rounded-xl transition-colors flex-1 sm:flex-initial"
                  >
                    <FiPlus size={16} />
                    <span>Schedule</span>
                  </button>
                  
                  <button
                    className="flex items-center justify-center gap-2 bg-dark-4 hover:bg-dark-5 text-light-1 px-4 py-2 rounded-xl transition-colors flex-1 sm:flex-initial"
                  >
                    <FiClock size={16} />
                    <span>History</span>
                  </button>
                </div>
              </div>
              
              {/* Simple calendar header */}
              <div className="mb-5 bg-dark-4 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <button className="p-2 hover:bg-dark-5 rounded-xl transition-colors">
                    <FiChevronRight className="rotate-180" />
                  </button>
                  <h3 className="text-lg font-semibold text-light-1">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button className="p-2 hover:bg-dark-5 rounded-xl transition-colors">
                    <FiChevronRight />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="text-xs text-light-3 py-1">{day}</div>
                  ))}
                </div>
              </div>
              
              {isLoadingMeetings ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin h-10 w-10 border-3 border-primary-500 border-t-transparent rounded-full"></div>
                </div>
              ) : upcomingMeetings.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-light-1 mb-3">Upcoming Meetings</h3>
                  
                  <div className="divide-y divide-dark-4">
                    {upcomingMeetings.map((meeting, index) => (
                      <motion.div
                        key={meeting.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group py-4 hover:bg-dark-4 rounded-xl transition-all px-2 cursor-pointer flex items-center"
                        onClick={() => navigateToMeeting(meeting)}
                      >
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-16 h-16 bg-primary-500/10 rounded-xl flex flex-col items-center justify-center border border-primary-500/20">
                            <span className="text-primary-500 text-xs font-medium">{meeting.date.split(' ')[0]}</span>
                            <span className="text-light-1 text-xl font-bold">{meeting.date.split(' ')[1]}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-medium text-light-1 truncate group-hover:text-primary-400 transition-colors">
                            {meeting.title}
                          </h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <div className="flex items-center text-xs text-light-3">
                              <FiClock className="mr-1" size={12} />
                              {meeting.time}
                            </div>
                            <div className="flex items-center text-xs text-light-3">
                              <div className="w-1 h-1 bg-light-4 rounded-full mr-2"></div>
                              <span className="text-secondary-400">in {meeting.startingIn}</span>
                            </div>
                            <div className="flex items-center text-xs text-light-3">
                              <div className="w-1 h-1 bg-light-4 rounded-full mr-2"></div>
                              Group: <span className="text-light-2 ml-1">{meeting.group}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 ml-2">
                          <button className="px-3 py-1.5 bg-primary-500 text-dark-1 rounded-xl text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Join
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-dark-4 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCalendar className="text-light-3" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-light-1 mb-2">No Upcoming Meetings</h3>
                  <p className="text-light-3 mb-6 max-w-md mx-auto">
                    You don't have any scheduled meetings. Create one to collaborate with your groups.
                  </p>
                  <button
                    onClick={navigateToMeetings}
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-light-1 rounded-xl transition-colors inline-flex items-center gap-2"
                  >
                    <FiCalendar size={18} />
                    <span>View Meeting Calendar</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Resources Tab Content */}
          {activeTab === "resources" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-dark-3 rounded-xl p-5 shadow-lg border border-dark-5"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-light-1 flex items-center gap-2">
                    <FiBook className="text-primary-500" />
                    Learning Resources
                  </h2>
                  <p className="text-light-3 text-sm sm:text-base mt-1">
                    Access educational materials, documents, and shared content
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
                  <FiBook className="text-primary-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-light-1 mb-3">Resources Coming Soon</h3>
                <p className="text-light-3 max-w-lg mb-8">
                  Educational resources, documents, and shared materials will be available in a future update. 
                  Stay tuned for a comprehensive library of learning materials!
                </p>
                
                {/* Feature preview cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-4">
                  <div className="bg-dark-4 rounded-xl p-4 border border-dark-5">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiBook className="text-primary-500" size={18} />
                    </div>
                    <h4 className="font-medium text-light-1 mb-1">Study Materials</h4>
                    <p className="text-xs text-light-3">Access shared notes, documents, and resources</p>
                  </div>
                  
                  <div className="bg-dark-4 rounded-xl p-4 border border-dark-5">
                    <div className="w-12 h-12 bg-secondary-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiAward className="text-secondary-500" size={18} />
                    </div>
                    <h4 className="font-medium text-light-1 mb-1">Quizzes & Tests</h4>
                    <p className="text-xs text-light-3">Practice with interactive assessments</p>
                  </div>
                  
                  <div className="bg-dark-4 rounded-xl p-4 border border-dark-5">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiGlobe className="text-green-500" size={18} />
                    </div>
                    <h4 className="font-medium text-light-1 mb-1">External Resources</h4>
                    <p className="text-xs text-light-3">Links to helpful websites and tools</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Notifications Tab Content */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-dark-3 rounded-xl p-5 shadow-lg border border-dark-5"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-light-1 flex items-center gap-2">
                    <FiBell className={`${unreadCount > 0 ? 'text-secondary-500' : 'text-primary-500'}`} />
                    Notifications 
                    {unreadCount > 0 && (
                      <span className="ml-2 text-xs bg-secondary-500 text-dark-1 px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </h2>
                  <p className="text-light-3 text-sm sm:text-base mt-1">
                    Stay updated with messages, meetings, and important events
                  </p>
                </div>
                
                {notifications.length > 0 && (
                  <button
                    onClick={navigateToNotifications}
                    className="flex items-center justify-center gap-2 bg-dark-4 hover:bg-dark-5 text-light-1 px-4 py-2 rounded-xl transition-colors w-full sm:w-auto"
                  >
                    <FiCheckCircle size={16} />
                    <span>Mark All as Read</span>
                  </button>
                )}
              </div>
              
              {isLoadingNotifications ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin h-10 w-10 border-3 border-primary-500 border-t-transparent rounded-full"></div>
                </div>
              ) : notifications.length > 0 ? (
                <div>
                  {/* Unread notifications section */}
                  {unreadCount > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-light-3 uppercase tracking-wider mb-3 px-2">
                        Unread Notifications
                      </h3>
                      
                      <div className="space-y-3">
                        {notifications.filter((n: NotificationUI) => !n.isRead).map((notification: NotificationUI, index) => {
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
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="bg-dark-4 border-l-2 border-secondary-500 rounded-xl p-4 hover:bg-dark-5 transition-colors cursor-pointer"
                              onClick={() => navigateToNotifications()}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 ${getTypeColor()} rounded-full flex items-center justify-center flex-shrink-0`}>
                                  {getTypeIcon()}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-light-1">{notification.title}</h4>
                                  <p className="text-sm text-light-3 mt-1">{notification.message}</p>
                                  
                                  <div className="flex items-center mt-2 text-xs text-light-4">
                                    <FiClock className="mr-1" />
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    
                                    {notification.groupName && (
                                      <span className="ml-3 px-2 py-0.5 bg-dark-3 rounded-full">
                                        {notification.groupName}
                                      </span>
                                    )}
                                    
                                    {notification.channelName && (
                                      <span className="ml-2 px-2 py-0.5 bg-dark-3 rounded-full">
                                        # {notification.channelName}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Read notifications section */}
                  {notifications.filter((n: NotificationUI) => n.isRead).length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-light-3 uppercase tracking-wider mb-3 px-2">
                        Earlier Notifications
                      </h3>
                      
                      <div className="space-y-3">
                        {notifications.filter((n: NotificationUI) => n.isRead).slice(0, 5).map((notification: NotificationUI, index) => {
                          const getTypeColor = () => {
                            switch (notification.type) {
                              case 'channel_message': return 'bg-blue-600/70';
                              case 'meeting_created': return 'bg-green-600/70';
                              case 'role_upgrade_requested': return 'bg-purple-600/70';
                              default: return 'bg-gray-600/70';
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
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="bg-dark-4 rounded-xl p-4 hover:bg-dark-5 transition-colors cursor-pointer opacity-80 hover:opacity-100"
                              onClick={() => navigateToNotifications()}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 ${getTypeColor()} rounded-full flex items-center justify-center flex-shrink-0`}>
                                  {getTypeIcon()}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-light-2">{notification.title}</h4>
                                  <p className="text-sm text-light-3 mt-1">{notification.message}</p>
                                  
                                  <div className="flex items-center mt-2 text-xs text-light-4">
                                    <FiClock className="mr-1" />
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      
                      {notifications.filter((n: NotificationUI) => n.isRead).length > 5 && (
                        <div className="mt-4 text-center">
                          <button
                            onClick={navigateToNotifications}
                            className="text-primary-500 hover:text-primary-400 text-sm font-medium transition-colors"
                          >
                            View All Notifications
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-dark-4 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBell className="text-light-3" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-light-1 mb-2">All Caught Up!</h3>
                  <p className="text-light-3 mb-6 max-w-md mx-auto">
                    You don't have any notifications at the moment. We'll notify you when something important happens.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Activity Feed */}
        {activeTab === "overview" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-6 sm:mt-8"
          >
            <div className="bg-dark-3 rounded-xl overflow-hidden shadow-lg border border-dark-5">
              <div className="p-4 sm:p-5 border-b border-dark-4 flex items-center gap-2">
                <FiActivity className="text-primary-500" size={20} />
                <h2 className="text-lg sm:text-xl font-semibold">Learning Progress</h2>
              </div>
              
              {/* Enhanced activity visualization */}
              <div className="p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10">
                <div className="flex-1 text-center lg:text-left">
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-2xl sm:text-3xl font-bold text-light-1 mb-3 bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text"
                  >
                    Your Educational Journey
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-light-3 mb-6 max-w-xl"
                  >
                    Track your collaborative learning progress across all your educational groups. 
                    Your engagement is growing steadily!
                  </motion.p>
                  
                  {/* Achievement cards */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="bg-dark-4 rounded-xl p-3 border border-dark-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                          <FiMessageSquare className="text-primary-500" size={16} />
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-light-3">Active Discussions</div>
                          <div className="text-xl font-bold text-light-1">{Math.floor(Math.random() * 15) + 5}</div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="bg-dark-4 rounded-xl p-3 border border-dark-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary-500/20 rounded-full flex items-center justify-center">
                          <FiAward className="text-secondary-500" size={16} />
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-light-3">Points Earned</div>
                          <div className="text-xl font-bold text-light-1">{Math.floor(Math.random() * 500) + 500}</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <button 
                      onClick={navigateToGroups}
                      className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-light-1 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
                    >
                      <span>Find More Study Groups</span>
                      <FiArrowRight />
                    </button>
                  </motion.div>
                </div>
                
                {/* Interactive activity visualization */}
                <div className="w-full max-w-sm lg:max-w-md">
                  <div className="relative h-72 sm:h-80 w-full bg-dark-4 rounded-xl overflow-hidden shadow-inner">
                    {/* Background grid */}
                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                      {[...Array(36)].map((_, i) => (
                        <div key={i} className="border-[0.5px] border-dark-5"></div>
                      ))}
                    </div>
                    
                    {/* Animated activity graph */}
                    <div className="absolute inset-0 p-6">
                      <svg className="w-full h-full" viewBox="0 0 100 50">
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(85, 112, 241, 0.8)" />
                            <stop offset="100%" stopColor="rgba(107, 70, 193, 0.8)" />
                          </linearGradient>
                          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        
                        {/* Activity area */}
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 2, delay: 0.7 }}
                          d="M0,50 C10,35 15,40 25,30 C35,20 40,35 50,25 C60,15 70,20 80,10 C90,15 95,5 100,10 L100,50 L0,50 Z"
                          fill="url(#progressGradient)"
                          fillOpacity="0.2"
                          stroke="none"
                        />
                        
                        {/* Activity line */}
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: 0.7 }}
                          d="M0,50 C10,35 15,40 25,30 C35,20 40,35 50,25 C60,15 70,20 80,10 C90,15 95,5 100,10"
                          fill="none"
                          stroke="url(#progressGradient)"
                          strokeWidth="2"
                          filter="url(#glow)"
                        />
                        
                        {/* Activity points */}
                        {[
                          { x: 10, y: 35 },
                          { x: 25, y: 30 },
                          { x: 40, y: 35 },
                          { x: 50, y: 25 },
                          { x: 70, y: 20 },
                          { x: 80, y: 10 },
                          { x: 95, y: 5 },
                        ].map((point, index) => (
                          <motion.circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r="3"
                            fill="#fff"
                            filter="url(#glow)"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.8 + index * 0.15 }}
                          />
                        ))}
                      </svg>
                      
                      {/* Labels */}
                      <div className="absolute bottom-1 left-0 right-0 flex justify-between text-xs text-light-4">
                        <span>Jan</span>
                        <span>Mar</span>
                        <span>May</span>
                        <span>Jul</span>
                        <span>Sep</span>
                        <span>Now</span>
                      </div>
                    </div>
                    
                    {/* Activity metrics */}
                    <div className="absolute top-4 left-4 right-4 flex flex-wrap justify-between gap-2">
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="bg-dark-2/80 backdrop-blur-sm p-2 rounded-xl text-xs"
                      >
                        <span className="text-light-3">Learning Streak</span>
                        <div className="text-primary-500 font-bold flex items-center gap-1">
                          <span>{Math.floor(Math.random() * 30) + 10}</span>
                          <span className="text-green-500">↑</span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3 }}
                        className="bg-dark-2/80 backdrop-blur-sm p-2 rounded-xl text-xs"
                      >
                        <span className="text-light-3">Meetings Attended</span>
                        <div className="text-primary-500 font-bold flex items-center gap-1">
                          <span>{Math.floor(Math.random() * 20) + 5}</span>
                          <span className="text-green-500">↑</span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 }}
                        className="bg-dark-2/80 backdrop-blur-sm p-2 rounded-xl text-xs"
                      >
                        <span className="text-light-3">Study Hours</span>
                        <div className="text-primary-500 font-bold flex items-center gap-1">
                          <span>{Math.floor(Math.random() * 50) + 20}</span>
                          <span className="text-green-500">↑</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;

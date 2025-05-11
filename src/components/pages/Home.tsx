import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";
import { useGetJoinedGroupsQuery } from "@/features/root/groups/slices/groupApiSlice";
import { useGetNotificationsQuery } from "@/features/root/notifications";
import { useGetCalls, ExtendedCall } from "@/hooks/useGetCalls";
import { Meeting } from "@/components/pages/ScheduledMeetings";
import { NotificationUI } from "@/features/root/notifications/components/NotificationItem";
import { 
  FiUsers, FiBell, FiCalendar, FiClock, FiChevronRight, FiPlus, 
  FiSettings, FiBook, FiMessageSquare, FiCheckCircle, FiGlobe, FiAward 
} from "react-icons/fi";
import { RiTeamLine } from "react-icons/ri";

// Import components from features directory
import HomeHero from "@/features/root/Home/components/HomeHero";
import HomeSearchBar from "@/features/root/Home/components/HomeSearchBar";
import HomeNavTabs from "@/features/root/Home/components/HomeNavTabs";
import HomeOverviewTab from "@/features/root/Home/components/tabs/HomeOverviewTab";
import HomeActivityFeed from "@/features/root/Home/components/HomeActivityFeed";

// Import utils
import { formatDateString, formatTimeString, formatMeetingTime } from "@/features/root/Home/utils/dateUtils";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const user = useSelector(selectCurrentUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  
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
  const navigate = useNavigate();
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

  return (
    <div className="p-3 sm:p-6 bg-dark-2 text-light-1 h-full overflow-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Greeting */}
        <HomeHero 
          joinedGroups={joinedGroups}
          upcomingMeetings={upcomingMeetings}
          notifications={notifications}
          unreadCount={unreadCount}
        />
        
        {/* Search & Quick Actions Bar */}
        <HomeSearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredGroups={filteredGroups}
        />
        
        {/* Navigation Tabs */}
        <HomeNavTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadCount={unreadCount}
        />
        
        {/* Main Content Based on Selected Tab */}
        <div className="mb-6">
          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <HomeOverviewTab 
              joinedGroups={joinedGroups}
              upcomingMeetings={upcomingMeetings}
              notifications={notifications}
              unreadCount={unreadCount}
              isLoadingGroups={isLoadingGroups}
              isLoadingMeetings={isLoadingMeetings}
              isLoadingNotifications={isLoadingNotifications}
            />
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
                    onClick={() => navigate("/discover-groups")}
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
                        onClick={() => navigate(`/${group._id}/channels`)}
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
                    onClick={() => navigate("/discover-groups")}
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
                    onClick={() => navigate("/scheduled-meetings")}
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
                        onClick={() => navigate(`/${meeting.groupId}/${meeting.channelId}/meeting/${meeting.id}`)}
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
                    onClick={() => navigate("/scheduled-meetings")}
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
                    onClick={() => navigate("/notifications")}
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
                              onClick={() => navigate("/notifications")}
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
                              onClick={() => navigate("/notifications")}
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
                            onClick={() => navigate("/notifications")}
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
        {activeTab === "overview" && <HomeActivityFeed />}
      </div>
    </div>
  );
};

export default Home;

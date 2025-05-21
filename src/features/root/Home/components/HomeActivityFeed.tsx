import { motion } from "framer-motion";
import { FiActivity, FiArrowRight, FiMessageSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { useGetJoinedGroupsQuery } from "@/features/root/groups/slices/groupApiSlice";

const HomeActivityFeed = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || "";
  
  // Fetch groups data from existing endpoint
  const { 
    data: joinedGroups = [], 
    isLoading,
    error 
  } = useGetJoinedGroupsQuery(userId, { skip: !userId });
  
  // Calculate metrics based on existing data
  const groupCount = joinedGroups?.length || 0;
  const totalMembers = joinedGroups?.reduce((sum, group) => sum + (group.members?.length || 0), 0) || 0;
  
  // Since we don't have user.createdAt, use a default value for months active
  // or calculate based on the oldest group join date if available
  const monthsActive = joinedGroups?.length > 0 
    ? Math.max(1, Math.ceil(
      (new Date().getTime() - new Date(
        [...joinedGroups].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )[0]?.createdAt || new Date()
      ).getTime()) / (30 * 24 * 60 * 60 * 1000)
    ))
    : 1;
  
  // Generate activity history based on groups joined over time (simulated)
  const [activityPath, setActivityPath] = useState<string>("");
  
  useEffect(() => {
    if (joinedGroups?.length) {
      // Sort groups by creation date
      const sortedGroups = [...joinedGroups].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      // Generate points based on when groups were joined
      const points: {x: number, y: number}[] = [];
      
      if (sortedGroups.length === 1) {
        // If only one group, create a simple upward trend
        points.push({x: 0, y: 40});
        points.push({x: 50, y: 30});
        points.push({x: 100, y: 10});
      } else {
        // Use actual group join dates to create visualization points
        const earliestDate = new Date(sortedGroups[0].createdAt).getTime();
        const latestDate = new Date().getTime();
        const timeRange = latestDate - earliestDate;
        
        sortedGroups.forEach((group, index) => {
          const groupDate = new Date(group.createdAt).getTime();
          const xPosition = timeRange ? ((groupDate - earliestDate) / timeRange) * 100 : 50;
          // Create a descending y-value (in SVG, lower y is higher up)
          const yValue = Math.max(10, 40 - (index * (30 / Math.max(sortedGroups.length, 1))));
          points.push({x: xPosition, y: yValue});
        });
      }
      
      // Add start and end points if needed
      if (points[0]?.x > 5) {
        points.unshift({x: 0, y: 45});
      }
      if (points[points.length-1]?.x < 95) {
        points.push({x: 100, y: 10});
      }
      
      // Create SVG path
      const pathPoints = points.map(p => `${p.x},${p.y}`).join(" L");
      const path = `M${pathPoints} L100,50 L0,50 Z`;
      setActivityPath(path);
    }
  }, [joinedGroups]);
  
  const navigateToGroups = () => {
    navigate("/discover-groups");
  };
  
  // Loading state
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-6 sm:mt-8"
      >
        <div className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl overflow-hidden shadow-lg border border-dark-5 dark:border-dark-5 light:border-light-bg-5 p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-6 bg-dark-5 dark:bg-dark-5 light:bg-light-bg-5 rounded w-1/3 mb-4"></div>
            <div className="h-24 bg-dark-5 dark:bg-dark-5 light:bg-light-bg-5 rounded w-full"></div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-6 sm:mt-8"
      >
        <div className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl overflow-hidden shadow-lg border border-dark-5 dark:border-dark-5 light:border-light-bg-5 p-8 text-center">
          <div className="text-red-500">
            <h3 className="text-lg font-semibold text-light-1 dark:text-light-1 light:text-light-text-1">Unable to load group data</h3>
            <p className="text-light-3 dark:text-light-3 light:text-light-text-3">Please try again later or contact support if the problem persists.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="mt-6 sm:mt-8"
    >
      <div className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl overflow-hidden shadow-lg border border-dark-5 dark:border-dark-5 light:border-light-bg-5">
        <div className="p-4 sm:p-5 border-b border-dark-4 dark:border-dark-4 light:border-light-bg-4 flex items-center gap-2">
          <FiActivity className="text-primary-500" size={20} />
          <h2 className="text-lg sm:text-xl font-semibold text-light-1 dark:text-light-1 light:text-light-text-1">Learning Progress</h2>
        </div>
        
        {/* Enhanced activity visualization */}
        <div className="p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10">
          <div className="flex-1 text-center lg:text-left">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-light-1 dark:text-light-1 light:text-light-text-1 mb-3 bg-gradient-to-r from-primary-400 dark:from-primary-400 light:from-primary-500 to-secondary-400 dark:to-secondary-400 light:to-secondary-500 text-transparent bg-clip-text"
            >
              {user?.fullName ? `${user.fullName}'s Educational Journey` : 'Your Educational Journey'}
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-light-3 dark:text-light-3 light:text-light-text-3 mb-6 max-w-xl"
            >
              Track your collaborative learning progress across {groupCount} educational {groupCount === 1 ? 'group' : 'groups'}.
              {monthsActive > 1 && ` You've been growing your knowledge for ${monthsActive} ${monthsActive === 1 ? 'month' : 'months'}.`}
            </motion.p>
            
            {/* Achievement cards */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-xl p-3 border border-dark-5 dark:border-dark-5 light:border-light-bg-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500/20 dark:bg-primary-500/20 light:bg-primary-500/30 rounded-full flex items-center justify-center">
                    <FiMessageSquare className="text-primary-500 dark:text-primary-500 light:text-primary-600" size={16} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-light-3 dark:text-light-3 light:text-light-text-3">Study Groups</div>
                    <div className="text-xl font-bold text-light-1 dark:text-light-1 light:text-light-text-1">{groupCount}</div>
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
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-light-1 dark:text-light-1 light:text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
              >
                <span>Find More Study Groups</span>
                <FiArrowRight />
              </button>
            </motion.div>
          </div>
          
          {/* Interactive activity visualization */}
          <div className="w-full max-w-sm lg:max-w-md">
            <div className="relative h-72 sm:h-80 w-full bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-xl overflow-hidden shadow-inner">
              {/* Background grid */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
                {[...Array(36)].map((_, i) => (
                  <div key={i} className="border-[0.5px] border-dark-5 dark:border-dark-5 light:border-light-bg-5"></div>
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
                    <linearGradient id="progressGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(65, 95, 225, 0.9)" />
                      <stop offset="100%" stopColor="rgba(90, 50, 180, 0.9)" />
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
                    d={activityPath || "M0,50 C10,35 15,40 25,30 C35,20 40,35 50,25 C60,15 70,20 80,10 C90,15 95,5 100,10 L100,50 L0,50 Z"}
                    fill="url(#progressGradient)"
                    className="dark:fill-opacity-20 light:fill-opacity-30"
                    stroke="none"
                  />
                  
                  {/* Activity line */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.7 }}
                    d={activityPath ? activityPath.replace(" L100,50 L0,50 Z", "") : "M0,50 C10,35 15,40 25,30 C35,20 40,35 50,25 C60,15 70,20 80,10 C90,15 95,5 100,10"}
                    fill="none"
                    stroke="url(#progressGradient)"
                    className="dark:stroke-current light:stroke-[url(#progressGradientLight)]"
                    strokeWidth="2"
                    filter="url(#glow)"
                  />
                  
                  {/* Activity points */}
                  {joinedGroups.map((_, index, arr) => {
                    // Calculate positions based on group join dates
                    const step = 100 / Math.max(arr.length - 1, 1);
                    const x = index * step;
                    const y = 50 - ((index + 1) * (40 / arr.length));
                    return (
                      <motion.circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="3"
                        className="fill-white dark:fill-white light:fill-primary-600"
                        filter="url(#glow)"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.15 }}
                      />
                    );
                  })}
                </svg>
                
                {/* Labels */}
                <div className="absolute bottom-1 left-0 right-0 flex justify-between text-xs text-light-4 dark:text-light-4 light:text-light-text-4">
                  {monthsActive <= 12 ? (
                    <>
                      <span>{monthsActive > 8 ? monthsActive - 8 : 0} months ago</span>
                      <span>{monthsActive > 5 ? monthsActive - 5 : 0} months ago</span>
                      <span>{monthsActive > 3 ? monthsActive - 3 : 0} months ago</span>
                      <span>{monthsActive > 1 ? monthsActive - 1 : 0} months ago</span>
                      <span>Now</span>
                    </>
                  ) : (
                    <>
                      <span>1 year ago</span>
                      <span>9 months ago</span>
                      <span>6 months ago</span>
                      <span>3 months ago</span>
                      <span>Now</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Activity metrics */}
              <div className="absolute top-4 left-4 right-4 flex flex-wrap justify-between gap-2">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-dark-2/80 dark:bg-dark-2/80 light:bg-white/80 backdrop-blur-sm p-2 rounded-xl text-xs shadow-sm"
                >
                  <span className="text-light-3 dark:text-light-3 light:text-light-text-3">Groups Joined</span>
                  <div className="text-primary-500 dark:text-primary-500 light:text-primary-600 font-bold flex items-center gap-1">
                    <span>{groupCount}</span>
                    {groupCount > 0 && <span className="text-green-500">↑</span>}
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  className="bg-dark-2/80 dark:bg-dark-2/80 light:bg-white/80 backdrop-blur-sm p-2 rounded-xl text-xs shadow-sm"
                >
                  <span className="text-light-3 dark:text-light-3 light:text-light-text-3">Average Members</span>
                  <div className="text-primary-500 dark:text-primary-500 light:text-primary-600 font-bold flex items-center gap-1">
                    <span>{groupCount > 0 ? Math.round(totalMembers / groupCount) : 0}</span>
                    {groupCount > 0 && <span className="text-green-500">↑</span>}
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="bg-dark-2/80 dark:bg-dark-2/80 light:bg-white/80 backdrop-blur-sm p-2 rounded-xl text-xs shadow-sm"
                >
                  <span className="text-light-3 dark:text-light-3 light:text-light-text-3">Months Active</span>
                  <div className="text-primary-500 dark:text-primary-500 light:text-primary-600 font-bold flex items-center gap-1">
                    <span>{monthsActive}</span>
                    <span className="text-green-500">↑</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeActivityFeed; 
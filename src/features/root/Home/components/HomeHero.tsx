import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBell, FiCalendar, FiUser } from "react-icons/fi";
import { RiTeamLine } from "react-icons/ri";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";
import { Meeting } from "@/components/pages/ScheduledMeetings";
import { NotificationUI } from "@/features/root/notifications/components/NotificationItem";

// Animation variants
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

interface HomeHeroProps {
  joinedGroups: any[];
  upcomingMeetings: Meeting[];
  notifications: NotificationUI[];
  unreadCount: number;
}

const HomeHero = ({ 
  joinedGroups,
  upcomingMeetings,
  unreadCount
}: HomeHeroProps) => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  
  
  const navigateToGroups = () => {
    navigate("/discover-groups");
  };
  
  const navigateToMeetings = () => {
    navigate("/scheduled-meetings");
  };
  
  const navigateToNotifications = () => {
    navigate("/notifications");
  };

  return (
    <motion.div 
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      className="mb-6 sm:mb-10"
    >
      <div className="relative rounded-2xl bg-gradient-to-br from-primary-500/20 via-dark-3 dark:via-dark-3 light:via-light-bg-3 to-dark-4 dark:to-dark-4 light:to-light-bg-4 p-6 sm:p-8 overflow-hidden transition-colors duration-200">
        {/* Dynamic animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Animated floating orbs */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                i % 2 === 0 
                  ? 'bg-primary-500/10 dark:bg-primary-500/10 light:bg-primary-500/30' 
                  : 'bg-secondary-500/10 dark:bg-secondary-500/10 light:bg-secondary-500/30'
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
                opacity: [
                  0.2, 
                  0.6, 
                  0.3
                ]
              }}
              transition={{
                repeat: Infinity,
                repeatType: 'reverse',
                duration: Math.random() * 5 + 5
              }}
            />
          ))}
          
          {/* Light beams with enhanced brightness */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-primary-500/30 dark:from-primary-500/30 light:from-primary-500/50 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-secondary-500/30 dark:from-secondary-500/30 light:from-secondary-500/50 to-transparent rounded-full blur-3xl"></div>
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
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-primary-500/50 relative z-10"
                  />
                  <motion.div 
                    className="absolute -inset-1 rounded-xl z-[2] bg-gradient-to-r from-primary-500 to-secondary-500 opacity-70 dark:opacity-70 light:opacity-90 blur-sm"
                    animate={{ 
                      scale: [1, 1.08, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  />
                  <motion.div 
                    className="absolute -inset-3 rounded-2xl z-[1] bg-gradient-to-r from-secondary-500 to-primary-500 opacity-50 dark:opacity-40 light:opacity-70 blur-lg"
                    animate={{ 
                      scale: [0.9, 1.1, 0.9],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  />
                </div>
              ) : (
                <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 text-primary-500 z-10">
                  <FiUser size={32} />
                  <motion.div 
                    className="absolute -inset-1 rounded-xl z-[2] bg-gradient-to-r from-primary-500 to-secondary-500 opacity-70 dark:opacity-70 light:opacity-90 blur-sm"
                    animate={{ 
                      scale: [1, 1.08, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  />
                  <motion.div 
                    className="absolute -inset-3 rounded-2xl z-[1] bg-gradient-to-r from-secondary-500 to-primary-500 opacity-50 dark:opacity-40 light:opacity-70 blur-lg"
                    animate={{ 
                      scale: [0.9, 1.1, 0.9],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse'
                    }}
                  />
                </div>
              )}
              
              {/* Online status indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-dark-3 dark:border-dark-3 light:border-light-bg-3 rounded-full shadow-md">
                <motion.div
                  className="absolute inset-0 bg-green-400 rounded-full"
                  animate={{
                    scale: [0.85, 1.15, 0.85],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
            
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-1 bg-gradient-to-r from-primary-400 via-light-1 dark:via-light-1 light:via-light-text-1 to-secondary-400 text-transparent bg-clip-text animate-gradient">
                  Welcome back, {user?.username || 'Scholar'}
                </h1>
                <p className="text-light-2 dark:text-light-2 light:text-light-text-2 text-base sm:text-xl">
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
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6"
          >
            <motion.div 
              variants={itemVariants}
              className="bg-dark-4/80 dark:bg-dark-4/80 light:bg-light-bg-4/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-dark-5 dark:border-dark-5 light:border-light-bg-5 hover:border-primary-500/50 transition-colors group"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigateToGroups()}
            >
              <div className="p-2 bg-primary-500/20 rounded-xl group-hover:bg-primary-500/30 transition-colors">
                <RiTeamLine className="text-primary-500" size={24} />
              </div>
              <div>
                <div className="text-light-3 dark:text-light-3 light:text-light-text-3 text-xs sm:text-sm">Active Groups</div>
                <div className="font-semibold text-light-1 dark:text-light-1 light:text-light-text-1 text-base sm:text-lg">{joinedGroups.length || 0}</div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="bg-dark-4/80 dark:bg-dark-4/80 light:bg-light-bg-4/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-dark-5 dark:border-dark-5 light:border-light-bg-5 hover:border-secondary-500/50 dark:hover:border-secondary-500/50 light:hover:border-light-secondary-500/50 transition-colors group"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigateToNotifications()}
            >
              <div className="p-2 bg-secondary-500/20 dark:bg-secondary-500/20 light:bg-light-secondary-500/20 rounded-xl group-hover:bg-secondary-500/30 dark:group-hover:bg-secondary-500/30 light:group-hover:bg-light-secondary-500/30 transition-colors">
                <FiBell className={unreadCount > 0 ? "text-secondary-500 dark:text-secondary-500 light:text-light-secondary-500" : "text-light-3 dark:text-light-3 light:text-light-text-3"} size={24} />
              </div>
              <div>
                <div className="text-light-3 dark:text-light-3 light:text-light-text-3 text-xs sm:text-sm">Notifications</div>
                <div className="font-semibold text-light-1 dark:text-light-1 light:text-light-text-1 text-base sm:text-lg flex items-center gap-2">
                  {unreadCount > 0 ? (
                    <>
                      <span>{unreadCount}</span>
                      <span className="text-xs px-2 py-0.5 bg-secondary-500/20 dark:bg-secondary-500/20 light:bg-light-secondary-500/20 text-secondary-500 dark:text-secondary-500 light:text-light-secondary-500 rounded-full">New</span>
                    </>
                  ) : (
                    <span>All caught up</span>
                  )}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="bg-dark-4/80 dark:bg-dark-4/80 light:bg-light-bg-4/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-dark-5 dark:border-dark-5 light:border-light-bg-5 hover:border-primary-500/50 transition-colors group"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigateToMeetings()}
            >
              <div className="p-2 bg-primary-500/20 rounded-xl group-hover:bg-primary-500/30 transition-colors">
                <FiCalendar className="text-primary-500" size={24} />
              </div>
              <div>
                <div className="text-light-3 dark:text-light-3 light:text-light-text-3 text-xs sm:text-sm">Upcoming Meetings</div>
                <div className="font-semibold text-light-1 dark:text-light-1 light:text-light-text-1 text-base sm:text-lg">{upcomingMeetings.length || 0}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeHero; 
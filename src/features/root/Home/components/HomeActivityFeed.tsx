import { motion } from "framer-motion";
import { FiActivity, FiArrowRight, FiMessageSquare, FiAward } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const HomeActivityFeed = () => {
  const navigate = useNavigate();

  const navigateToGroups = () => {
    navigate("/discover-groups");
  };

  return (
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
  );
};

export default HomeActivityFeed; 
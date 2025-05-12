import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface HomeSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredGroups: any[];
}

const HomeSearchBar = ({ 
  searchQuery, 
  setSearchQuery, 
  filteredGroups 
}: HomeSearchBarProps) => {
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const navigateToGroups = () => {
    navigate("/discover-groups");
  };
  
  const navigateToGroup = (groupId: string) => {
    navigate(`/${groupId}/channels`);
  };

  return (
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
  );
};

export default HomeSearchBar; 
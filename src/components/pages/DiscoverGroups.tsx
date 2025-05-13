import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllGroupsQuery, useGetGroupsByCategoryQuery } from "@/features/root/groups/slices/groupApiSlice";
import { Input } from "@/components/ui/input";
import { FiSearch, FiUsers, FiBook, FiCode, FiGlobe, FiPlus, FiFilter, FiChevronRight, FiInfo } from "react-icons/fi";
import { RiTeamLine } from "react-icons/ri";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import GroupCard from "@/features/root/groups/components/GroupCard";
import CreateGroupDialog from "@/features/root/groups/dialogs/CreateGroupDialog";

// Define categories with icons
const categories = [
  { id: "all", name: "All Groups", icon: <FiUsers className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: "education", name: "Education", icon: <FiBook className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: "tech", name: "Technology", icon: <FiCode className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: "other", name: "Other", icon: <FiGlobe className="w-4 h-4 sm:w-5 sm:h-5" /> },
];

const DiscoverGroups: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [page] = useState(1);
  const limit = 12;

  // Use the appropriate query based on selected category
  const { 
    data: allGroups = [], 
    isLoading: isLoadingAllGroups, 
    isError: isAllGroupsError 
  } = useGetAllGroupsQuery(undefined, {
    skip: selectedCategory !== "all"
  });

  const { 
    data: categoryGroups = [], 
    isLoading: isLoadingCategoryGroups, 
    isError: isCategoryGroupsError 
  } = useGetGroupsByCategoryQuery(
    { category: selectedCategory, page, limit },
    { skip: selectedCategory === "all" }
  );

  // Determine which data and loading state to use
  const groups = selectedCategory === "all" ? allGroups : categoryGroups;
  const isLoading = selectedCategory === "all" ? isLoadingAllGroups : isLoadingCategoryGroups;
  const isError = selectedCategory === "all" ? isAllGroupsError : isCategoryGroupsError;

  // Focus search input on mount and when category changes
  useEffect(() => {
    searchInputRef.current?.focus();
  }, [selectedCategory]);

  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-6 bg-dark-2 text-light-1 h-full overflow-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-dark-4 to-dark-3 rounded-2xl p-6 sm:p-8 mb-6 shadow-lg border border-dark-5"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-light-1 mb-2 flex items-center gap-2">
                <RiTeamLine className="text-primary-500" size={28} />
                Discover Learning Groups
              </h1>
              <p className="text-light-3 text-sm sm:text-base max-w-xl">
                Find and join groups that match your educational interests and goals. Connect with peers and expand your learning network.
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateGroupDialogOpen(true)}
              className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-light-1 px-5 py-3 rounded-xl transition-colors shadow-md w-full sm:w-auto"
            >
              <FiPlus size={18} />
              <span className="font-medium">Create Group</span>
            </motion.button>
          </div>
          
          {/* Stats Row */}
          <div className="flex flex-wrap mt-6 gap-4">
            <div className="bg-dark-4/70 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <FiUsers className="text-primary-500" size={16} />
              </div>
              <div>
                <p className="text-xs text-light-3">Total Groups</p>
                <p className="text-lg font-semibold text-light-1">{groups.length}</p>
              </div>
            </div>
            
            <div className="bg-dark-4/70 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-secondary-500/20 flex items-center justify-center">
                <FiBook className="text-secondary-500" size={16} />
              </div>
              <div>
                <p className="text-xs text-light-3">Education Groups</p>
                <p className="text-lg font-semibold text-light-1">
                  {groups.filter(g => g.category && 
                    (typeof g.category === 'string' 
                      ? g.category === 'education'
                      : Array.isArray(g.category) && g.category.includes('education'))
                  ).length || "..."}
                </p>
              </div>
            </div>
            
            <div className="bg-dark-4/70 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <FiGlobe className="text-primary-400" size={16} />
              </div>
              <div>
                <p className="text-xs text-light-3">Open to Join</p>
                <p className="text-lg font-semibold text-light-1">
                  {groups.filter(g => g.isJoinableExternally).length || "..."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Search & Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-dark-3 rounded-xl p-4 mb-6 border border-dark-5 shadow-md"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-3" size={18} />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search groups by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-dark-4 border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl text-sm shadow-inner w-full"
              />
            </div>
            
            {/* Filter Button - Mobile */}
            <Button 
              variant="outline" 
              className="sm:hidden flex items-center justify-center gap-2 border-dark-5 bg-dark-4 text-light-2 hover:bg-dark-5"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FiFilter size={16} />
              <span>Filter</span>
              <FiChevronRight className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-90' : ''}`} />
            </Button>
          </div>
          
          {/* Category Tabs - Desktop */}
          <div className="hidden sm:block mt-4">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="bg-dark-4 p-1 rounded-xl">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary-500 data-[state=active]:text-light-1 rounded-xl transition-all"
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Category Tabs - Mobile, expandable */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="sm:hidden overflow-hidden mt-3"
              >
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                  <TabsList className="flex flex-col bg-dark-4 p-1 rounded-xl w-full">
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="flex items-center justify-between w-full gap-2 px-4 py-3 data-[state=active]:bg-primary-500 data-[state=active]:text-light-1 rounded-xl transition-all mb-1 last:mb-0"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span>{category.name}</span>
                        </div>
                        {category.id === selectedCategory && (
                          <div className="w-2 h-2 rounded-full bg-light-1"></div>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Results Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-between items-center mb-4 px-1"
        >
          <div className="text-sm text-light-3">
            {isLoading ? (
              <span>Searching groups...</span>
            ) : (
              <span>Showing <span className="text-light-1 font-medium">{filteredGroups.length}</span> groups</span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-light-3">
            <span>Sort by:</span>
            <select className="bg-dark-3 text-light-2 rounded-xl border border-dark-4 py-1 px-2 text-sm">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="members">Members</option>
            </select>
          </div>
        </motion.div>
        
        {/* Groups Grid */}
        <div className="min-h-[200px]">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-light-3 animate-pulse">Discovering groups for you...</p>
            </div>
          ) : isError ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-8 bg-dark-3 rounded-xl border border-dark-5"
            >
              <div className="w-16 h-16 bg-dark-4 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiInfo className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-light-1 mb-2">Error Loading Groups</h3>
              <p className="text-light-3 mb-6 max-w-md mx-auto">
                We encountered a problem loading the groups. Please try again later.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-primary-500 hover:bg-primary-600 text-light-1"
              >
                Retry
              </Button>
            </motion.div>
          ) : filteredGroups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-8 bg-dark-3 rounded-xl border border-dark-5"
            >
              <div className="w-16 h-16 bg-dark-4 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-light-3" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-light-1 mb-2">No Groups Found</h3>
              <p className="text-light-3 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? "No groups match your search criteria. Try adjusting your search terms."
                  : "No groups are available in this category yet. Check back later or create your own!"}
              </p>
              <Button 
                onClick={() => setIsCreateGroupDialogOpen(true)}
                className="bg-primary-500 hover:bg-primary-600 text-light-1 flex items-center gap-2"
              >
                <FiPlus size={16} />
                <span>Create Group</span>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <AnimatePresence>
                {filteredGroups.map((group, index) => (
                  <motion.div
                    key={group._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="h-full"
                  >
                    <GroupCard
                      group={{
                        _id: group._id,
                        name: group.name,
                        description: group.description,
                        avatar: group.avatar ?? "",
                        createdAt: group.createdAt,
                        isJoinableExternally: group.isJoinableExternally,
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Create Group Dialog */}
      <CreateGroupDialog 
        isOpen={isCreateGroupDialogOpen} 
        onClose={() => setIsCreateGroupDialogOpen(false)} 
      />
    </div>
  );
};

export default DiscoverGroups;

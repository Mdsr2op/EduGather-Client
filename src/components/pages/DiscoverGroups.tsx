import React, { useState, useRef, useEffect } from "react";
import GroupCard from "@/features/root/groups/components/GroupCard";
import { useGetAllGroupsQuery, useGetJoinedGroupsQuery, useGetGroupsByCategoryQuery } from "@/features/root/groups/slices/groupApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Input } from "@/components/ui/input";
import { FiSearch, FiUsers, FiBook, FiCode, FiGlobe, FiPlus } from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const categories = [
  { id: "all", name: "All Groups", icon: <FiUsers className="w-5 h-5" /> },
  { id: "education", name: "Education", icon: <FiBook className="w-5 h-5" /> },
  { id: "tech", name: "Technology", icon: <FiCode className="w-5 h-5" /> },
  { id: "other", name: "Other", icon: <FiGlobe className="w-5 h-5" /> },
];

const DiscoverGroups: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?._id ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

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
    <div className="flex flex-col p-3 sm:p-4 md:p-6 bg-dark-2 h-full overflow-hidden">
      <header className="flex flex-col gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-light-1 mb-1 sm:mb-2">Discover Groups</h1>
            <p className="text-sm sm:text-base text-light-3">Find and join groups that match your interests</p>
          </div>
          <Button className="bg-primary-500 hover:bg-primary-600 text-light-1 gap-2 px-4 sm:px-6 py-2 sm:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto">
            <FiPlus className="w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10" />
            <span className="text-sm sm:text-base md:text-lg">Create Group</span>
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-2xl">
          <FiSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-light-3" size={20} />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search groups by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 sm:pl-12 h-10 sm:h-12 bg-dark-3 border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200"
          />
        </div>

        {/* Category Filters */}
        <ScrollArea className="w-full">
          <div className="bg-dark-3 rounded-xl p-1 shadow-sm min-w-full">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="w-auto justify-start bg-transparent p-0 flex-nowrap overflow-x-auto">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl text-xs sm:text-sm data-[state=active]:bg-primary-500 data-[state=active]:text-light-1 data-[state=active]:shadow-lg transition-all duration-200 hover:bg-dark-4 whitespace-nowrap"
                  >
                    {category.icon}
                    <span className="font-medium">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </ScrollArea>
      </header>

      {/* Groups Grid */}
      <div className="overflow-y-auto flex-1">
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {isLoading && (
            <div className="col-span-full flex justify-center items-center min-h-[200px] sm:min-h-[300px]">
              <div className="animate-spin rounded-xl h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          )}
          
          {isError && (
            <div className="col-span-full text-center p-4 sm:p-6 md:p-8 bg-dark-3 rounded-xl border border-dark-5 shadow-sm">
              <p className="text-red-500 text-sm sm:text-base md:text-lg font-medium">Error loading groups</p>
              <p className="text-light-3 text-xs sm:text-sm mt-1 sm:mt-2">Please try again later</p>
            </div>
          )}
          
          {!isLoading && !isError && filteredGroups.length === 0 && (
            <div className="col-span-full text-center p-6 sm:p-8 md:p-12 bg-dark-3 rounded-xl border border-dark-5 shadow-sm">
              <FiUsers className="mx-auto text-light-3" size={40} />
              <p className="text-light-1 text-lg sm:text-xl font-semibold mt-3 sm:mt-4">No groups found</p>
              <p className="text-light-3 text-xs sm:text-sm mt-1 sm:mt-2 max-w-md mx-auto">
                {searchQuery
                  ? "Try adjusting your search terms to find what you're looking for"
                  : "No groups are available for discovery at the moment. Check back later!"}
              </p>
            </div>
          )}
          
          {!isLoading &&
            !isError &&
            filteredGroups.map((group) => (
              <GroupCard
                key={group._id}
                group={{
                  _id: group._id,
                  name: group.name,
                  description: group.description,
                  avatar: group.avatar ?? "",
                  createdAt: group.createdAt,
                  isJoinableExternally: group.isJoinableExternally,
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverGroups;

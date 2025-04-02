import React, { useState, useRef, useEffect } from "react";
import GroupCard from "@/features/root/groups/components/GroupCard";
import { useGetAllGroupsQuery, useGetJoinedGroupsQuery } from "@/features/root/groups/slices/groupApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { Input } from "@/components/ui/input";
import { FiSearch, FiUsers, FiBook, FiCode, FiGlobe, FiPlus } from "react-icons/fi";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "all", name: "All Groups", icon: <FiUsers className="w-5 h-5" /> },
  { id: "education", name: "Education", icon: <FiBook className="w-5 h-5" /> },
  { id: "tech", name: "Technology", icon: <FiCode className="w-5 h-5" /> },
  { id: "other", name: "Other", icon: <FiGlobe className="w-5 h-5" /> },
];

const DiscoverGroups: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?._id ?? "");
  const { data: groups = [], isLoading: isLoadingGroups, isError: isGroupsError } = useGetAllGroupsQuery();
  const { data: joinedGroups = [], isLoading: isLoadingJoined } = useGetJoinedGroupsQuery(userId, { skip: !userId });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isLoading = isLoadingGroups || isLoadingJoined;
  const isError = isGroupsError;

  // Focus search input on mount and when category changes
  useEffect(() => {
    searchInputRef.current?.focus();
  }, [selectedCategory]);

  // Filter out groups that the user has already joined
  const joinedGroupIds = new Set(joinedGroups.map(group => group._id));
  const availableGroups = groups.filter(group => !joinedGroupIds.has(group._id));

  // Filter groups based on search query
  const filteredGroups = availableGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col p-6 bg-dark-2 h-full">
      <header className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-light-1 mb-2">Discover Groups</h1>
            <p className="text-light-3">Find and join groups that match your interests</p>
          </div>
          <Button className="bg-primary-500 hover:bg-primary-600 text-light-1 gap-2 px-6 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            <FiPlus className="w-5 h-5" />
            <span className="text-lg">Create Group</span>
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light-3" size={20} />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search groups by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-dark-3 border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl text-base shadow-sm hover:shadow-md transition-all duration-200"
          />
        </div>

        {/* Category Filters */}
        <div className="bg-dark-3 rounded-xl p-1 shadow-sm">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-auto justify-start bg-transparent p-0">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl data-[state=active]:bg-primary-500 data-[state=active]:text-light-1 data-[state=active]:shadow-lg transition-all duration-200 hover:bg-dark-4"
                >
                  {category.icon}
                  <span className="font-medium">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading && (
          <div className="col-span-full flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-xl h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}
        
        {isError && (
          <div className="col-span-full text-center p-8 bg-dark-3 rounded-xl border border-dark-5 shadow-sm">
            <p className="text-red-500 text-lg font-medium">Error loading groups</p>
            <p className="text-light-3 mt-2">Please try again later</p>
          </div>
        )}
        
        {!isLoading && !isError && filteredGroups.length === 0 && (
          <div className="col-span-full text-center p-12 bg-dark-3 rounded-xl border border-dark-5 shadow-sm">
            <FiUsers className="mx-auto text-light-3" size={64} />
            <p className="text-light-1 text-xl font-semibold mt-4">No groups found</p>
            <p className="text-light-3 mt-2 max-w-md mx-auto">
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
  );
};

export default DiscoverGroups;

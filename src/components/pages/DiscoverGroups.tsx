import React from "react";
import GroupCard from "@/features/root/groups/components/GroupCard";
import { useGetAllGroupsQuery } from "@/features/root/groups/slices/groupApiSlice"; 

const DiscoverGroups: React.FC = () => {
  const { data: groups = [], isLoading, isError } = useGetAllGroupsQuery();

  return (
    <div className="flex flex-col p-6 bg-dark-2 h-full">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-light-1">Discover Groups</h1>
        <button className="px-4 py-2 bg-primary-500 text-light-1 rounded hover:bg-primary-600">
          Create Group
        </button>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading && (
          <p className="col-span-full text-light-3 text-center">Loading groups...</p>
        )}
        {isError && (
          <p className="col-span-full text-red text-center">Error loading groups.</p>
        )}
        {!isLoading && !isError && groups.length === 0 && (
          <p className="col-span-full text-light-3 text-center">
            No groups available for discovery.
          </p>
        )}
        {!isLoading &&
          !isError &&
          groups.map((group) => (
            <GroupCard
              key={group._id}
              group={{
                _id: group._id,
                name: group.name,
                description: group.description,
                // You probably want `group.avatar` here (typo in original code used "group.avatar" as a string):
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

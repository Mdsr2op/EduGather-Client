// src/components/pages/DiscoverGroups.tsx
import React from "react";
import GroupCard from "@/features/root/groups/components/GroupCard";
import { useGetJoinedGroupsQuery } from "@/features/root/groups/slices/groupApiSlice";

const dummyGroups = [
  {
    _id: "1",
    name: "React Developers",
    description: "A group for React enthusiasts to share knowledge and resources.",
    avatar: "https://via.placeholder.com/100", // Placeholder image URL
    members: [{ _id: "1", name: "John Doe" }, { _id: "2", name: "Jane Doe" }],
    coverImage: "https://via.placeholder.com/600x200",
    createdBy: "admin1",
    createdAt: "2024-01-01T10:00:00Z",
    isJoinableExternally: true,
  },
  {
    _id: "2",
    name: "Node.js Developers",
    description: "A community for Node.js developers to discuss backend development.",
    avatar: null,
    members: [{ _id: "1", name: "Alice" }, { _id: "2", name: "Bob" }],
    coverImage: null,
    createdBy: "admin2",
    createdAt: "2024-01-02T10:00:00Z",
    isJoinableExternally: true,
  },
  {
    _id: "3",
    name: "Design Patterns",
    description: "Discuss and learn about software design patterns.",
    avatar: null,
    members: [],
    coverImage: null,
    createdBy: "admin3",
    createdAt: "2024-01-03T10:00:00Z",
    isJoinableExternally: false,
  },
  {
    _id: "4",
    name: "AI and ML Enthusiasts",
    description: "Share insights, projects, and ideas related to AI and Machine Learning.",
    avatar: "https://via.placeholder.com/100",
    members: [
      { _id: "1", name: "Eve" },
      { _id: "2", name: "Charlie" },
      { _id: "3", name: "Dave" },
    ],
    coverImage: "https://via.placeholder.com/600x200",
    createdBy: "admin4",
    createdAt: "2024-01-04T10:00:00Z",
    isJoinableExternally: true,
  },
];

const DiscoverGroups: React.FC = () => {
  const userId = "dummyUserId"; 
  const { data: groups = dummyGroups, isLoading, isError } = useGetJoinedGroupsQuery(userId, {
    skip: !userId,
  });

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
                avatar: "group.avatar",
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

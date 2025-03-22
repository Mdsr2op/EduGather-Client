// src/features/groups/components/GroupCard.tsx
import React from "react";
import { FiUsers, FiPlus } from "react-icons/fi";
import { useJoinGroupMutation } from "../slices/groupApiSlice";

interface Member {
  _id: string;
  name: string;
}

interface Group {
  _id: string;
  name: string;
  description: string;
  avatar?: string;
  coverImage?: string;
  createdAt: string;
  isJoinableExternally: boolean;
}

interface GroupCardProps {
  group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const [joinGroup, { isLoading }] = useJoinGroupMutation();

  const handleJoinGroup = async () => {
    try {
      await joinGroup({ groupId: group._id }).unwrap();
      alert(`Joined group: ${group.name}`);
    } catch (error) {
      console.error("Failed to join group:", error);
      alert("Failed to join the group. Please try again.");
    }
  };

  return (
    <div className="bg-dark-3 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col justify-between">
      {/* Cover Image */}
      {group.coverImage && (
        <div className="w-full h-32 bg-cover bg-center" style={{ backgroundImage: `url(${group.coverImage})` }} />
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* Group Header */}
        <div className="flex items-center mb-3">
          {/* Avatar */}
          {group.avatar ? (
            <img
              src={group.avatar}
              alt={`${group.name} avatar`}
              className="w-12 h-12 rounded-full mr-3"
            />
          ) : (
            <div className="w-12 h-12 bg-light-3 rounded-full mr-3 flex items-center justify-center">
              <FiUsers className="text-dark-1" size={20} />
            </div>
          )}
          {/* Group Name */}
          <h3 className="text-lg font-semibold text-light-1 truncate">{group.name}</h3>
        </div>

        {/* Description */}
        <p className="text-sm text-light-3 mb-2 line-clamp-3">{group.description}</p>

        {/* Join Button */}
        {group.isJoinableExternally && (
          <button
            onClick={handleJoinGroup}
            disabled={isLoading}
            className="mt-auto px-4 py-2 bg-primary-500 text-light-1 rounded hover:bg-primary-600 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Join group ${group.name}`}
          >
            <FiPlus className="mr-2" />
            {isLoading ? "Joining..." : "Join Group"}
          </button>
        )}
        {!group.isJoinableExternally && (
          <p className="text-xs text-red mt-auto">This group is private.</p>
        )}
      </div>
    </div>
  );
};

export default GroupCard;

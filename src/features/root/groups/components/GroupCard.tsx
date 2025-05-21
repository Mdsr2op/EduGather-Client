// src/features/groups/components/GroupCard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiPlus, FiCalendar, FiLock } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useJoinGroupMutation } from "../slices/groupApiSlice";
import { formatDistanceToNow } from "date-fns";

interface Group {
  _id: string;
  name: string;
  description: string;
  avatar?: string;
  createdAt: string;
  isJoinableExternally: boolean;
}

interface GroupCardProps {
  group: Group;
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const [joinGroup, { isLoading }] = useJoinGroupMutation();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleJoinGroup = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent any parent click events
    console.log("Join button clicked"); // Debug logging
    
    try {
      await joinGroup({ groupId: group._id }).unwrap();
      toast.success(`Successfully joined ${group.name}!`, {
        position: "top-center"
      });
      // Navigate to group after successful join
      setTimeout(() => {
        navigate(`/${group._id}/channels`);
      }, 1000);
    } catch (error) {
      console.error("Failed to join group:", error);
      toast.error("Failed to join the group. Please try again.", {
        position: "top-center"
      });
    }
  };

  // Create a color based on group name for groups without avatars
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsla(${hue}, 70%, 60%, 0.2)`;
  };

  const avatarBgColor = stringToColor(group.name);
  const createdAt = new Date(group.createdAt);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  // Handle hover states manually
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div 
      className="h-full transform transition-transform duration-300 hover:-translate-y-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl border border-dark-5 dark:border-dark-5 light:border-light-bg-5 shadow-md hover:shadow-lg overflow-visible transition-all duration-300 flex flex-col h-full group relative">
        {/* Card Top Section with Gradient Overlay */}
        <div className="relative h-28 overflow-visible">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-dark-4 dark:to-dark-4 light:to-light-bg-4 rounded-t-xl"
            style={{ backgroundColor: avatarBgColor }}
          >
            {/* Abstract pattern overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
              <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`grid-${group._id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 0 20 L 40 20 M 20 0 L 20 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${group._id})`} />
              </svg>
            </div>
          </div>

          {/* Group Avatar Positioned at Bottom */}
          <div className="absolute -bottom-8 left-4 w-16 h-16 rounded-xl shadow-lg overflow-hidden border-2 border-dark-3 dark:border-dark-3 light:border-light-bg-3 z-10">
            {group.avatar ? (
              <img
                src={group.avatar}
                alt={`${group.name} avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500/30 to-primary-600/10 flex items-center justify-center">
                <FiUsers className="text-light-1 dark:text-light-1 light:text-light-text-1" size={24} />
              </div>
            )}
          </div>

          {/* Join Status Badge */}
          <div className="absolute top-3 right-3 z-10">
            {group.isJoinableExternally ? (
              <span className="px-2 py-1 bg-primary-500/80 text-light-1 dark:text-light-1 light:text-white text-xs rounded-full flex items-center">
                Open to Join
              </span>
            ) : (
              <span className="px-2 py-1 bg-dark-1/80 dark:bg-dark-1/80 light:bg-light-bg-1/80 text-light-3 dark:text-light-3 light:text-light-text-3 text-xs rounded-full flex items-center gap-1">
                <FiLock size={10} />
                Private
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 pt-10 flex flex-col flex-1">
          {/* Group Name */}
          <h3 className="text-lg font-semibold text-light-1 dark:text-light-1 light:text-light-text-1 group-hover:text-primary-400 transition-colors line-clamp-1">
            {group.name}
          </h3>

          {/* Created time */}
          <div className="flex items-center text-xs text-light-3 dark:text-light-3 light:text-light-text-3 mt-1 mb-3">
            <FiCalendar size={12} className="mr-1" />
            Created {timeAgo}
          </div>

          {/* Description */}
          <p className="text-sm text-light-3 dark:text-light-3 light:text-light-text-3 line-clamp-3 flex-grow">
            {group.description || "No description available for this group."}
          </p>

          {/* Action Area - Important: very high z-index to ensure clickability */}
          <div className="mt-4 pt-3 border-t border-dark-4 dark:border-dark-4 light:border-light-bg-4 relative z-50">
            {group.isJoinableExternally ? (
              <button
                onClick={handleJoinGroup}
                disabled={isLoading}
                style={{ cursor: 'pointer' }}
                className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-light-1 dark:text-light-1 light:text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label={`Join group ${group.name}`}
              >
                <FiPlus className="mr-2" size={16} />
                {isLoading ? "Joining..." : "Join Group"}
              </button>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3 flex items-center">
                  <FiLock size={12} className="mr-1" />
                  This is a private group
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Card border highlight instead of overlay */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-200 pointer-events-none ${
          isHovered ? 'ring-2 ring-primary-400/30' : ''
        }`} />
      </div>
    </div>
  );
};

export default GroupCard;
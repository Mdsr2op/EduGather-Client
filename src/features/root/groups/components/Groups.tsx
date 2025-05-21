import React from "react";
import { FaCircle } from "react-icons/fa";
import { UserJoinedGroups } from "../slices/groupSlice";
import { useTheme } from "@/context/ThemeContext";

interface GroupsProps {
  joinedGroups: UserJoinedGroups[];
  selectedGroupId: string;
  onGroupClick: (groupId: string) => void;
  onGroupContextMenu: (e: React.MouseEvent, group: UserJoinedGroups) => void;
  onCloseContextMenu: () => void;
}

const Groups: React.FC<GroupsProps> = ({
  joinedGroups,
  selectedGroupId,
  onGroupClick,
  onGroupContextMenu,
  onCloseContextMenu,
}) => {
  const { theme } = useTheme();

  if (!joinedGroups || joinedGroups.length === 0) {
    return <div className={`${theme === 'dark' ? 'text-light-3' : 'text-light-text-3'} text-center p-3`}>You have not joined any groups yet.</div>;
  }

  return (
    <div 
      className={`flex flex-col space-y-3 w-full overflow-y-auto custom-scrollbar max-h-72 p-3 
                rounded-xl border-2 ${theme === 'dark' ? 'border-dark-4 bg-gradient-to-b from-dark-2 to-dark-3 scrollbar-thumb-dark-4 scrollbar-track-dark-2' : 'border-light-bg-4 bg-gradient-to-b from-light-bg-2 to-light-bg-3 scrollbar-thumb-light-bg-4 scrollbar-track-light-bg-2'} 
                shadow-md scrollbar-thin`} 
      onClick={onCloseContextMenu}
    >
      <div className={`text-xs font-medium ${theme === 'dark' ? 'text-light-3' : 'text-light-text-3'} text-center uppercase tracking-wider px-1 mb-1`}>Groups</div>
      {joinedGroups.map((group) => (
        <div
          key={group._id}
          className="relative flex items-center justify-center 
                     cursor-pointer transition-all transform hover:scale-110 hover:brightness-110"
          onClick={() => onGroupClick(group._id)}
          onContextMenu={(e) => onGroupContextMenu(e, group)}
          title={group.name}
        >
          <div
            className={`rounded-full ${
              selectedGroupId === group._id ? "ring-2 ring-primary-500" : ""
            }`}
            style={{ padding: selectedGroupId === group._id ? "2px" : "0" }}
          >
            <img
              src={group.avatar}
              alt={group.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          {selectedGroupId === group._id && (
            <FaCircle
              className="absolute bottom-0 right-0 text-primary-500"
              size={10}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Groups;

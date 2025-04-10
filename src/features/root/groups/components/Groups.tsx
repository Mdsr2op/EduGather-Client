import React from "react";
import { FaCircle } from "react-icons/fa";
import { UserJoinedGroups } from "../slices/groupSlice";

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
  if (!joinedGroups || joinedGroups.length === 0) {
    return <div>You have not joined any groups yet.</div>;
  }

  return (
    <div className="flex flex-col space-y-2 w-full" onClick={onCloseContextMenu}>
      {joinedGroups.map((group) => (
        <div
          key={group._id}
          className="relative flex items-center justify-center 
                     cursor-pointer transition-transform transform hover:scale-110"
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

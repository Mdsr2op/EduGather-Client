// SidebarGroup.tsx
import React from "react";
import { FaCircle } from "react-icons/fa";

export type Group = {
  id: number;
  name: string;
  image: string;
  createdBy: number;
  currentUserId: number;
};

type SidebarGroupProps = {
  groups: Group[];
  selectedGroupId: number | null;
  setSelectedGroupId: (id: number | null) => void;
  onGroupContextMenu: (e: React.MouseEvent, group: Group) => void;
};

const SidebarGroup: React.FC<SidebarGroupProps> = ({
  groups,
  selectedGroupId,
  setSelectedGroupId,
  onGroupContextMenu,
}) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      {groups.map((group) => (
        <div
          key={group.id}
          className="relative flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110"
          onClick={() => setSelectedGroupId(group.id)}
          onContextMenu={(e) => onGroupContextMenu(e, group)}
          title={group.name}
        >
          <div
            className={`rounded-full ${
              selectedGroupId === group.id ? "ring-2 ring-primary" : ""
            }`}
            style={{ padding: "2px" }}
          >
            <img
              src={group.image}
              alt={group.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          {selectedGroupId === group.id && (
            <FaCircle
              className="absolute bottom-0 right-0 text-primary"
              size={10}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SidebarGroup;

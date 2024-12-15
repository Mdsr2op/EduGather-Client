import React from "react";
import { FaCircle } from "react-icons/fa";

interface Group {
  id: string;
  name: string;
  image: string;
}

interface SidebarGroupProps {
  groups: Group[];
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
  onGroupContextMenu?: (event: React.MouseEvent<HTMLDivElement>, group: Group) => void;
}

const Groups: React.FC<SidebarGroupProps> = ({
  groups,
  selectedGroupId,
  setSelectedGroupId,
}) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      {groups.map((group) => (
        <div
          key={group.id}
          className="relative flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110"
          onClick={() => setSelectedGroupId(group.id)}
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

export default Groups;

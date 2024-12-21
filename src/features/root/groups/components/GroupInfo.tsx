import React from 'react';
import { MdEdit } from 'react-icons/md'; // Importing a different edit icon

type GroupInfoProps = {
  channelName: string;
  description: string;
  members: string[];
  createdBy: string;
  createdAt: string;
  groupAvatar: string;
};

const GroupInfo: React.FC<GroupInfoProps> = ({ channelName, description, members, createdBy, createdAt, groupAvatar }) => {
  const isAdmin = true; // Set this as true since you are the group admin

  return (
    <div className="p-8 bg-dark-3 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center mb-6">
        <img
          src={groupAvatar}
          alt={`${channelName} Avatar`}
          className="w-20 h-20 rounded-full object-cover mr-6 border-2 border-primary"
        />
        <div className="flex items-center w-full justify-between">
          <div>
            <h2 className="text-2xl font-bold text-light-1 mb-1">{channelName}</h2>
            <p className="text-xs text-light-3">{createdAt}</p>
          </div>
          {isAdmin && (
            <MdEdit className="text-light-1 ml-4 cursor-pointer text-xl" /> /* Aligned edit icon for channel name */
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-light-1 mb-2">Description</h3>
          {isAdmin && (
            <MdEdit className="text-light-1 cursor-pointer text-xl" /> /* Aligned edit icon for description */
          )}
        </div>
        <p className="text-sm text-light-3">{description}</p>
      </div>

      {/* Created By */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-light-1 mb-2">Created By</h3>
        </div>
        <p className="text-sm text-light-3">{createdBy}</p>
      </div>

      {/* Members */}
      <div>
        <h3 className="text-xl font-semibold text-light-1 mb-3">Members</h3>
        <div className="grid grid-cols-3 gap-4 h-48 overflow-y-auto custom-scrollbar pr-4"> {/* Changed to grid layout */}
          {members.map((member, index) => (
            <div key={index} className="flex items-center">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member)}&background=random`}
                alt={member}
                className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-primary"
              />
              <span className="text-sm text-light-3">{member}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-light-3 mt-2">Total Members: {members.length}</p>
      </div>
    </div>
  );
};

export default GroupInfo;

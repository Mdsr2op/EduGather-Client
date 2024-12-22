// Groups.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetJoinedGroupsQuery } from "../slices/groupApiSlice";
import { GroupState, selectSelectedGroupId, setSelectedGroupId } from "../slices/groupSlice";
import { AuthState } from "@/features/auth/slices/authSlice";
import { FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Groups: React.FC = () => {
  const dispatch = useDispatch();
  const selectedGroupId = useSelector((state: { group: GroupState }) => state.group.selectedGroupId);
  const userId = useSelector((state: { auth: AuthState }) => state.auth.user?._id ?? "");
  const navigate = useNavigate();

  // fetch data
  const {
    data: joinedGroups,
    isLoading,
    isError,
    error,
  } = useGetJoinedGroupsQuery(userId, {
    skip: !userId,
  });



  const handleGroupClick = (groupId: string) => {
    dispatch(setSelectedGroupId(groupId));
    navigate(`/${groupId}/channels`);
  };

  if (isLoading) {
    return <div>Loading your groups...</div>;
  }

  if (isError) {
    console.error(error);
    return <div>Error loading groups</div>;
  }

  if (!joinedGroups || joinedGroups.length === 0) {
    return <div>You have not joined any groups yet.</div>;
  }

  return (
    <div className="flex flex-col space-y-2 w-full">
    {joinedGroups.map((group) => (
      <div
        key={group._id}
        className="relative flex items-center justify-center cursor-pointer transition-transform transform hover:scale-110"
        onClick={() => handleGroupClick(group._id)}
        title={group.name}
      >
        <div
          className={`rounded-full ${
            selectedGroupId === group._id ? "ring-2 ring-primary-500" : ""
          }`}
          style={{ padding: "2px" }}
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

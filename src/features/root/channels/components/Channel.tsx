// Channel.tsx
import React from "react";
import { FiHash } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { openChannelContextMenu, setSelectedChannelId } from "../slices/channelSlice";
import { useNavigate } from "react-router-dom";
import { selectSelectedGroupId } from "../../groups/slices/groupSlice";

interface ChannelProps {
  id: string;
  name: string;
  isSelected: boolean;
}

const Channel: React.FC<ChannelProps> = ({ id, name, isSelected }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groupId = useSelector(selectSelectedGroupId) ?? "";


  const handleSelect = () => {
    dispatch(setSelectedChannelId(id));
    navigate(`/${groupId}/${id}`);
  };

  // Handler for right-click (context menu)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(
      openChannelContextMenu({
        position: { x: e.pageX, y: e.pageY },
        channelId: id,
      })
    );
  };

  return (
    <li
      className={`mt-2 p-2 rounded flex items-center cursor-pointer transition-colors duration-200 ${
        isSelected
          ? "bg-gradient-to-r from-primary-500 via-primary-600 to-blue-500 text-light-1"
          : "hover:bg-dark-4"
      }`}
      onClick={handleSelect}
      onContextMenu={handleContextMenu}
    >
      <FiHash className="mr-2" />
      <span className="truncate">{name}</span>
    </li>
  );
};

export default Channel;

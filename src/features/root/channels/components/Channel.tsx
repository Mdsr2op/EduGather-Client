import React from 'react';
import { FiHash } from 'react-icons/fi';

interface ChannelProps {
    name: string;
    isSelected: boolean;
    onSelect: () => void;
  }
  
  const Channel: React.FC<ChannelProps> = ({ name, isSelected, onSelect }) => (
  <li
    className={`mt-2 p-2 rounded flex items-center cursor-pointer transition-colors duration-200 ${
      isSelected ? 'bg-gradient-to-r from-primary-500 via-primary-600 to-blue-500 text-light1 text-light1' : 'hover:bg-dark4'
    }`}
    onClick={onSelect}
  >
    <FiHash className="mr-2" />
    <span className="truncate">{name}</span>
  </li>
);

export default Channel;

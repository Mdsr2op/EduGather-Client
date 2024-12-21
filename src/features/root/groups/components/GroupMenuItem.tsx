import React from 'react';
import { IconType } from 'react-icons';

type GroupMenuItemProps = {
  icon: IconType;
  label: string;
  onClick: () => void;
};

const GroupMenuItem: React.FC<GroupMenuItemProps> = ({ icon: Icon, label, onClick }) => {
  return (
    <li
      className="flex items-center px-4 py-2 hover:bg-dark-5 cursor-pointer"
      onClick={onClick}
    >
      <Icon className="mr-2" />
      {label}
    </li>
  );
};

export default GroupMenuItem;
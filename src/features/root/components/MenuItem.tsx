import React from 'react';
import { IconType } from 'react-icons';

type MenuItemProps = {
  icon?: IconType;
  label: string;
  onClick: () => void;
  isDanger?: boolean;
};

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, onClick, isDanger }) => (
  <li
    onClick={onClick}
    className={`flex items-center px-4 py-2 text-sm hover:bg-dark-3 cursor-pointer ${
      isDanger ? 'text-red' : 'text-white'
    }`}
  >
    {Icon && <Icon className="mr-2" />}
    {label}
  </li>
);

export default MenuItem;

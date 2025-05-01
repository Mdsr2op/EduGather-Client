import React from 'react';
import { IconType } from 'react-icons';

type MenuItemProps = {
  icon?: IconType;
  label: string;
  onClick: () => void;
  isDanger?: boolean;
  className?: string;
  disabled?: boolean;
};

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  isDanger,
  className = "",
  disabled = false
}) => (
  <li
    onClick={disabled ? undefined : onClick}
    className={`flex items-center px-4 py-2.5 text-sm transition-colors duration-150 ${
      disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-dark-3 cursor-pointer'
    } ${
      isDanger ? 'text-red hover:text-red' : 'text-light-1 hover:text-light-0'
    } ${className}`}
  >
    {Icon && <Icon className={`mr-3 ${isDanger ? 'text-red-500' : 'text-light-3'}`} size={16} />}
    <span className="font-medium">{label}</span>
  </li>
);

export default MenuItem;

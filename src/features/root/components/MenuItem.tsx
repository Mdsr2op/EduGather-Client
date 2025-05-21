import React from 'react';
import { IconType } from 'react-icons';
import { useTheme } from '../../../context/ThemeContext';

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
}) => {
  const { theme } = useTheme();
  
  return (
    <li
      onClick={disabled ? undefined : onClick}
      className={`flex items-center px-4 py-2.5 text-sm transition-colors duration-150 ${
        disabled 
          ? 'cursor-not-allowed opacity-50' 
          : `cursor-pointer ${
              theme === 'dark' 
                ? 'hover:bg-dark-3' 
                : 'hover:bg-light-bg-2'
            }`
      } ${
        isDanger 
          ? 'text-red hover:text-red' 
          : theme === 'dark'
            ? 'text-light-1 hover:text-light-0'
            : 'text-light-text-1 hover:text-light-text-2'
      } ${className}`}
    >
      {Icon && (
        <Icon 
          className={`mr-3 ${
            isDanger 
              ? 'text-red-500' 
              : theme === 'dark'
                ? 'text-light-3'
                : 'text-light-text-3'
          }`} 
          size={16} 
        />
      )}
      <span className="font-medium">{label}</span>
    </li>
  );
};

export default MenuItem;

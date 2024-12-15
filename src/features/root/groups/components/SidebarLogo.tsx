import React from "react";
import { FaBook } from "react-icons/fa";

interface SidebarLogoProps {
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({ onClick }) => {
  return (
    <div
      className="mb-4 cursor-pointer text-light2 hover:text-primary transition-colors duration-200"
      onClick={onClick}
      title="Home"
    >
      <FaBook size={30} />
    </div>
  );
};

export default SidebarLogo;

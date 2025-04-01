import React from "react";
import { FiFolder, FiBell } from "react-icons/fi";

interface OptionsSidebarProps {
  activeTab: "files" | "notifications";
  setActiveTab: React.Dispatch<React.SetStateAction<"files" | "notifications">>;
}

const OptionsSidebar: React.FC<OptionsSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="w-60 bg-dark-2 flex flex-col border-r border-dark-4">
      <button
        className={`flex items-center space-x-3 py-4 px-6 text-left transition-colors duration-200 ${
          activeTab === "files"
            ? "bg-dark-4 text-primary-500"
            : "text-light-3 hover:bg-dark-3 hover:text-light-1"
        }`}
        onClick={() => setActiveTab("files")}
      >
        <FiFolder className="w-5 h-5" />
        <span>Files</span>
      </button>
      <button
        className={`flex items-center space-x-3 py-4 px-6 text-left transition-colors duration-200 ${
          activeTab === "notifications"
            ? "bg-dark-4 text-primary-500"
            : "text-light-3 hover:bg-dark-3 hover:text-light-1"
        }`}
        onClick={() => setActiveTab("notifications")}
      >
        <FiBell className="w-5 h-5" />
        <span>Notification Settings</span>
      </button>
    </div>
  );
};

export default OptionsSidebar;

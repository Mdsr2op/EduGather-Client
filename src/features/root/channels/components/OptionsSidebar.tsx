import React from "react";
import { FiFolder, FiBell, FiX } from "react-icons/fi";

interface OptionsSidebarProps {
  activeTab: "files" | "notifications";
  setActiveTab: React.Dispatch<React.SetStateAction<"files" | "notifications">>;
  onClose?: () => void;
}

const OptionsSidebar: React.FC<OptionsSidebarProps> = ({
  activeTab,
  setActiveTab,
  onClose,
}) => {
  return (
    <div className="w-full md:w-64 bg-dark-2 flex flex-col border-r border-dark-4">
      <div className="p-4 md:p-6 relative">
        {/* Close button - only visible on mobile */}
        <div className="md:hidden absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-3 rounded-lg transition-colors duration-200"
            aria-label="Close"
          >
            <FiX size={20} className="text-light-3" />
          </button>
        </div>
        
        <h2 className="text-xl font-semibold text-light-1 mb-4 pr-8">Settings</h2>
        <div className="space-y-2">
          <button
            className={`w-full flex items-center space-x-3 py-4 px-4 rounded-xl text-left transition-all duration-200 active:scale-[0.98] ${
              activeTab === "files"
                ? "bg-primary-500/10 text-primary-500 shadow-sm"
                : "text-light-3 hover:bg-dark-3 hover:text-light-1"
            }`}
            onClick={() => setActiveTab("files")}
          >
            <FiFolder className={`w-6 h-6 ${activeTab === "files" ? "text-primary-500" : ""}`} />
            <span className="font-medium text-base">Files</span>
          </button>
          <button
            className={`w-full flex items-center space-x-3 py-4 px-4 rounded-xl text-left transition-all duration-200 active:scale-[0.98] ${
              activeTab === "notifications"
                ? "bg-primary-500/10 text-primary-500 shadow-sm"
                : "text-light-3 hover:bg-dark-3 hover:text-light-1"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <FiBell className={`w-6 h-6 ${activeTab === "notifications" ? "text-primary-500" : ""}`} />
            <span className="font-medium text-base">Notification Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionsSidebar;

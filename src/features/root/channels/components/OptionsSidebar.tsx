import React from "react";

interface OptionsSidebarProps {
  activeTab: "files" | "notifications";
  setActiveTab: React.Dispatch<React.SetStateAction<"files" | "notifications">>;
}

const OptionsSidebar: React.FC<OptionsSidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="w-60 bg-dark-5 flex flex-col">
      <button
        className={`py-4 px-6 text-left hover:bg-dark-6 ${
          activeTab === "files" ? "bg-dark-6" : ""
        }`}
        onClick={() => setActiveTab("files")}
      >
        Files
      </button>
      <button
        className={`py-4 px-6 text-left hover:bg-dark-6 ${
          activeTab === "notifications" ? "bg-dark-6" : ""
        }`}
        onClick={() => setActiveTab("notifications")}
      >
        Notification Settings
      </button>
    </div>
  );
};

export default OptionsSidebar;

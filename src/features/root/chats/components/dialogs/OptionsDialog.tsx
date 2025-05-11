import FilesPanel from "@/features/root/channels/components/FilesPanel";
import NotificationSettingsPanel from "@/features/root/channels/components/NotificationSettingsPannel";
import OptionsSidebar from "@/features/root/channels/components/OptionsSidebar";
import React, { useState, useEffect } from "react";
import { FiX, FiArrowLeft } from "react-icons/fi";

interface OptionsDialogProps {
  onClose: () => void;
}

const OptionsDialog: React.FC<OptionsDialogProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"files" | "notifications">("files");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dialog on ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleTabSelect = (tab: "files" | "notifications" | ((prev: "files" | "notifications") => "files" | "notifications")) => {
    setActiveTab(tab);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-sm">
      {/* Dialog Container */}
      <div className="bg-dark-3 text-light-1 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex overflow-hidden mx-4">
        
        {/* Sidebar - Hidden on mobile when content is shown */}
        <div className={`${isMobile && !showSidebar ? 'hidden' : ''} ${isMobile ? 'w-full' : ''} transition-all duration-300 ease-in-out`}>
          <OptionsSidebar activeTab={activeTab} setActiveTab={handleTabSelect} onClose={onClose} />
        </div>

        {/* Main Content Panel */}
        <div className={`flex-1 flex flex-col relative ${isMobile && showSidebar ? 'hidden' : ''} transition-all duration-300 ease-in-out`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-dark-3">
            <div className="flex items-center space-x-3">
              {isMobile && !showSidebar && (
                <button
                  className="p-2 hover:bg-dark-3 rounded-lg transition-colors duration-200"
                  onClick={() => setShowSidebar(true)}
                >
                  <FiArrowLeft size={20} className="text-light-3" />
                </button>
              )}
              <h2 className="text-xl font-semibold text-light-1">
                {activeTab === "files" ? "Files" : "Notification Settings"}
              </h2>
            </div>
            <button
              className="p-2 hover:bg-dark-3 rounded-lg transition-colors duration-200"
              onClick={onClose}
            >
              <FiX size={20} className="text-light-3" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "files" && <FilesPanel onClose={onClose} />}
            {activeTab === "notifications" && <NotificationSettingsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsDialog;

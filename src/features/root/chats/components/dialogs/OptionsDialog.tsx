import FilesPanel from "@/features/root/channels/components/FilesPanel";
import NotificationSettingsPanel from "@/features/root/channels/components/NotificationSettingsPannel";
import OptionsSidebar from "@/features/root/channels/components/OptionsSidebar";
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";


interface OptionsDialogProps {
  onClose: () => void;
}

const OptionsDialog: React.FC<OptionsDialogProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"files" | "notifications">("files");

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1 bg-opacity-50">
      {/* Dialog Container */}
      <div className="bg-dark-4 text-light-1 w-full max-w-4xl max-h-[80vh] rounded-lg shadow-lg flex overflow-hidden">
        
        {/* Sidebar */}
        <OptionsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Panel */}
        <div className="flex-1 flex flex-col relative">
          <button
            className="absolute top-4 right-4 hover:text-red"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>

          {activeTab === "files" && <FilesPanel />}
          {activeTab === "notifications" && <NotificationSettingsPanel />}
        </div>
      </div>
    </div>
  );
};

export default OptionsDialog;

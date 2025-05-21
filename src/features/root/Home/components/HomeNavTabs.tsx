import { motion } from "framer-motion";
import { FiHome, FiUsers, FiCalendar, FiBook, FiBell } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface HomeNavTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
}

const HomeNavTabs = ({ activeTab, setActiveTab, unreadCount }: HomeNavTabsProps) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: <FiHome size={16} /> },
    { id: "groups", label: "My Groups", icon: <FiUsers size={16} /> },
    { id: "meetings", label: "Meetings", icon: <FiCalendar size={16} /> },
    { id: "resources", label: "Resources", icon: <FiBook size={16} /> },
    { id: "notifications", label: "Alerts", icon: <FiBell size={16} /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="mb-6"
    >
      <div className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl p-1.5 flex items-center transition-colors duration-200">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-1 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary-500 text-light-1 shadow-md"
                  : "bg-transparent text-light-3 dark:text-light-3 light:text-light-text-3 hover:bg-dark-4 dark:hover:bg-dark-4 light:hover:bg-light-bg-4 hover:text-light-2 dark:hover:text-light-2 light:hover:text-light-text-2"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="hidden md:block">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === "notifications" && unreadCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 bg-secondary-500 dark:bg-secondary-500 light:bg-light-secondary-500 text-dark-1 dark:text-dark-1 light:text-light-1 text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HomeNavTabs; 
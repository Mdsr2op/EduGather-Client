import PinnedMessagesButton from "./dialogs/PinnedMessagesButton";
import SearchDialog from "./dialogs/SearchDialog";
import StartVideoCallDialog from "./dialogs/StartVideoCallDialog";
import OptionsButton from "./dialogs/OptionsButton";
import { useTheme } from "../../../../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const ChatHeaderActions = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 sm:gap-3 text-light-3 dark:text-light-3 light:text-light-text-3">
      <div className="hidden sm:block">
        <PinnedMessagesButton />
      </div>
      <SearchDialog />
      <StartVideoCallDialog />
      <button
        onClick={toggleTheme}
        className="p-2 hover:bg-light-bg-2 dark:hover:text-light-1 rounded-full transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
      <OptionsButton />
    </div>
  );
};

export default ChatHeaderActions;

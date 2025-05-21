import React, { useState } from "react";

const NotificationSettingsPanel: React.FC = () => {
  const [muteAll, setMuteAll] = useState(false);
  const [muteMentions, setMuteMentions] = useState(false);

  // Additional toggles can be added here

  return (
    <div className="p-6 overflow-auto bg-dark-3 dark:bg-dark-3 bg-light-2 light:bg-light-2">
      <h2 className="text-xl font-semibold mb-4 text-light-1 dark:text-light-1 text-light-text-1 light:text-light-text-1">Notification Settings</h2>
      
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="muteAll"
          className="mr-2"
          checked={muteAll}
          onChange={() => setMuteAll(!muteAll)}
        />
        <label htmlFor="muteAll" className="cursor-pointer text-light-1 dark:text-light-1 text-light-text-1 light:text-light-text-1">
          Mute all notifications
        </label>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="muteMentions"
          className="mr-2"
          checked={muteMentions}
          onChange={() => setMuteMentions(!muteMentions)}
        />
        <label htmlFor="muteMentions" className="cursor-pointer text-light-1 dark:text-light-1 text-light-text-1 light:text-light-text-1">
          Mute mentions
        </label>
      </div>

      {/* Add more notification settings as needed */}
    </div>
  );
};

export default NotificationSettingsPanel;

import React from "react";
import PinnedMessagesButton from "./dialogs/PinnedMessagesButton";
import SearchDialog from "./dialogs/SearchDialog";
import StartVideoCallDialog from "./dialogs/StartVideoCallDialog";
import OptionsButton from "./dialogs/OptionsButton";

type ChatHeaderActionsProps = {
  pinnedMessagesCount: number;
  openSearchDialog: () => void;
  openCreateMeetingDialog: () => void;
};

const ChatHeaderActions: React.FC<ChatHeaderActionsProps> = (
) => (
  <div className="flex items-center space-x-4 text-light-3 mr-4">
    <PinnedMessagesButton  />
    <SearchDialog  />
    <StartVideoCallDialog  />
    <OptionsButton />
  </div>
);

export default ChatHeaderActions;
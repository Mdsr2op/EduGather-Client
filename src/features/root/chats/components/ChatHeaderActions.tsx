import React from "react";
import PinnedMessagesButton from "./dialogs/PinnedMessagesButton";
import SearchDialog from "./dialogs/SearchDialog";
import StartVideoCallDialog from "./dialogs/StartVideoCallDialog";
import OptionsButton from "./dialogs/OptionsButton";


const ChatHeaderActions= () => (
  <div className="flex items-center space-x-4 text-light-3 mr-4">
    <PinnedMessagesButton />
    <SearchDialog />
    <StartVideoCallDialog />
    <OptionsButton />
  </div>
);

export default ChatHeaderActions;

import React from "react";
import PinnedMessagesButton from "./dialogs/PinnedMessagesButton";
import OptionsButton from "./dialogs/OptionsButton";
import SearchDialog from "./dialogs/SearchDialog";
import StartVideoCallDialog from "./dialogs/StartVideoCallDialog";


const ChatHeaderActions = ({
}) => (
  <div className="flex items-center space-x-4 text-light3 mr-4">
    <PinnedMessagesButton  />
    <SearchDialog />
    <StartVideoCallDialog  />
    <OptionsButton />
  </div>
);

export default ChatHeaderActions;

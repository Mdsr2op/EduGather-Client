import React from "react";
import PinnedMessagesButton from "./dialogs/PinnedMessagesButton";
import SearchDialog from "./dialogs/SearchDialog";
import StartVideoCallDialog from "./dialogs/StartVideoCallDialog";
import OptionsButton from "./dialogs/OptionsButton";

const ChatHeaderActions = () => (
  <div className="flex items-center gap-1 sm:gap-3 text-light-3">
    <div className="hidden sm:block">
      <PinnedMessagesButton />
    </div>
    <SearchDialog />
    <StartVideoCallDialog />
    <OptionsButton />
  </div>
);

export default ChatHeaderActions;

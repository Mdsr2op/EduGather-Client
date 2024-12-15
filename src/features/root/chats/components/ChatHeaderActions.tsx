import React from "react";
import PinnedMessagesButton from "./dialogs/PinnedMessagesButton";
import SearchButton from "./dialogs/SearchButton";
import VideoMeetingButton from "./dialogs/VideoMeetingButton";
import OptionsButton from "./dialogs/OptionsButton";


const ChatHeaderActions = ({
}) => (
  <div className="flex items-center space-x-4 text-light3 mr-4">
    <PinnedMessagesButton  />
    <SearchButton />
    <VideoMeetingButton  />
    <OptionsButton />
  </div>
);

export default ChatHeaderActions;

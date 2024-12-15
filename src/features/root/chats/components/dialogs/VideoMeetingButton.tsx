import React, { useState } from "react";
import { FiVideo } from "react-icons/fi";

const VideoMeetingButton = () => {


  return (
    <div className="relative group">
      <button className="hover:text-light1">
        <FiVideo size={20} className="text-light-3" />
      </button>
    </div>
  );
};

export default VideoMeetingButton;

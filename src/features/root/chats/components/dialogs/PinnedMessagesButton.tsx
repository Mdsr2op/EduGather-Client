import React, { useState } from "react";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";

const PinnedMessagesButton = () => {
    const [pinnedMessagesCount , setPinnedMessagesCount] = useState(4);
  return (
    <div className="relative group">
      <button
        className="relative hover:text-light1"
      >
        <PushPinOutlinedIcon className="text-light3" />
        {pinnedMessagesCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-secondary-500 text-black font-bold text-base rounded-full w-5 h-5 flex items-center justify-center">
            {pinnedMessagesCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default PinnedMessagesButton;

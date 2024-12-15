import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

const OptionsButton = () => {


  return (
    <div className="relative group">
      <button className="hover:text-light1">
        <FiMoreVertical size={20} className="text-light-3" />
      </button>
    </div>
  );
};

export default OptionsButton;

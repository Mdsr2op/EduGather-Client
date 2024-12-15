import React, { useState } from "react";
import { FiMoreVertical, FiSearch } from "react-icons/fi";

const SearchButton = () => {


  return (
    <div className="relative group">
      <button className="hover:text-light1">
        <FiSearch size={20} className="text-light3" />
      </button>
    </div>
  );
};

export default SearchButton;

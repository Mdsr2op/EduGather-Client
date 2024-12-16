import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiSearch, FiX } from "react-icons/fi";
import { Button } from "@mui/material";
import { Input } from "@/components/ui/input";
// import { useNavigate } from "react-router-dom";

const SearchButton = () => {
  const [query, setQuery] = useState("");
  // const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSearch = () => {
    console.log(query);
  };

  // Focus the input when the dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open && inputRef.current) {
      // inputRef.current.focus();
    }
  };

  return (
    <div className="relative group">
      <Dialog onOpenChange={handleOpenChange}>
        <DialogTrigger>
          <FiSearch size={20} className="text-light-3 cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="flex items-center justify-center w-full max-w-lg p-6 bg-dark-2 text-light-1 rounded-2xl shadow-xl">
          {/* Close Button */}
          <Button
            className="absolute top-3 right-3 text-light-3 hover:text-light-1 focus:outline-none"
            onClick={() => {} /* The Dialog component should handle closing */}
            aria-label="Close Search Dialog"
          >
            <FiX size={24} />
          </Button>

          {/* Dialog Header */}
          <DialogHeader>
            <DialogTitle className="text-xl font-medium mb-4">
              Search Messages
            </DialogTitle>
          </DialogHeader>

          {/* Search Input */}
          <div>
            <Input
              ref={inputRef}
              type="text"
              className="w-full px-4 py-2 bg-dark-4 text-light-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Type your search query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>

          {/* Search Button */}
          <div className="mt-6">
            <Button
              onClick={handleSearch}
              className="w-full px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchButton;

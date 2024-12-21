"use client";

import React, { useState } from "react";
import SidebarLogo from "../groups/components/SidebarLogo";
import SidebarDivider from "../groups/components/SidebarDivider";
import Groups from "../groups/components/Groups";
import CreateGroupDialog from "../groups/dialogs/CreateGroupDialog";
import AddGroupMenu from "../groups/menus/AddGroupMenu";
import { FaPlus } from "react-icons/fa";

const groups = [
  {
    id: "1",
    name: "Study Group A",
    image:
      "https://img.freepik.com/free-photo/smiling-students-working-together_1098-19019.jpg",
    createdBy: "1",
    currentUserId: "1",
  },
  {
    id: "2",
    name: "Study Group B",
    image:
      "https://img.freepik.com/free-photo/students-are-standing-front-classroom_1098-18745.jpg",
    createdBy: "2",
    currentUserId: "1",
  },
  {
    id: "3",
    name: "Study Group C",
    image:
      "https://img.freepik.com/free-photo/students-are-working-together_1098-17763.jpg",
    createdBy: "1",
    currentUserId: "1",
  },
];

const Sidebar = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>("1");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // State for "Join Group" dialog
  const [isJoinGroupDialogOpen, setIsJoinGroupDialogOpen] =
    useState<boolean>(false);

  // Only open Create Group dialog on left-click
  const handleLeftClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.button === 0) {
      setIsDialogOpen(true);
    }
  };

  // Open custom context menu on right-click
  const handleRightClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsMenuOpen(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setMenuPosition(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="w-20 bg-dark-5 h-full p-3 flex flex-col items-center overflow-hidden relative">
      <SidebarLogo onClick={() => setSelectedGroupId(null)} />
      <SidebarDivider />

      <Groups
        groups={groups}
        selectedGroupId={selectedGroupId}
        setSelectedGroupId={setSelectedGroupId}
      />

      <SidebarDivider />

      {/* Combined Trigger (Left-Click vs. Right-Click) */}
      <div
        className="mt-2 mb-2 cursor-pointer rounded-xl text-primary-500 bg-dark-3 p-3 hover:bg-dark-4 hover:shadow-lg transition duration-200 ease-in-out relative"
        onClick={handleLeftClick}
        onContextMenu={handleRightClick}
      >
        <FaPlus size={20} />
      </div>

      {/* Create Group Dialog */}
      {isDialogOpen && (
        <CreateGroupDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onClose={handleCloseDialog}
        />
      )}

      {/* Add Group Menu / Context Menu */}
      {isMenuOpen && menuPosition && (
        <AddGroupMenu
          position={menuPosition}
          isOpen={isMenuOpen}
          setIsCreateGroupDialog={setIsDialogOpen}
          isJoinGroupDialogOpen={isJoinGroupDialogOpen}
          setIsJoinGroupDialogOpen={setIsJoinGroupDialogOpen}
          setIsOpen={setIsMenuOpen}
          onClose={handleCloseMenu}
        />
      )}
    </div>
  );
};

export default Sidebar;

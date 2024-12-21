import React, { useState } from "react";
import SidebarLogo from "../groups/components/SidebarLogo";
import SidebarDivider from "../groups/components/SidebarDivider";
import Groups from "../groups/components/Groups";
import CreateGroupDialog from "../groups/dialogs/CreateGroupDialog";

// Group and icon data
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

  return (
    <div className="w-20 bg-dark-5 h-full p-3 flex flex-col items-center overflow-hidden">
      <SidebarLogo onClick={() => setSelectedGroupId(null)} />
      <SidebarDivider />

      <Groups
        groups={groups}
        selectedGroupId={selectedGroupId}
        setSelectedGroupId={setSelectedGroupId}
      />

      <SidebarDivider />

      <CreateGroupDialog />
    </div>
  );
};

export default Sidebar;

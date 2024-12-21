import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaVideo } from "react-icons/fa";
import SidebarLogo from "../groups/components/SidebarLogo";
import SidebarDivider from "../groups/components/SidebarDivider";
import SidebarGroup from "../groups/components/Groups";
import AddGroupButton from "../groups/components/AddGroupButton";
import ContextMenus from "./ContextMenus";


type Group = {
  id: number;
  name: string;
  image: string;
  createdBy: number;
  currentUserId: number;
};

type SidebarIcon = {
  id: string;
  name: string;
  icon: JSX.Element;
  route: string;
};

const groups: Group[] = [
  {
    id: 1,
    name: "Study Group A",
    image:
      "https://img.freepik.com/free-photo/smiling-students-working-together_1098-19019.jpg",
    createdBy: 1,
    currentUserId: 1,
  },
  {
    id: 2,
    name: "Study Group B",
    image:
      "https://img.freepik.com/free-photo/students-are-standing-front-classroom_1098-18745.jpg",
    createdBy: 2,
    currentUserId: 1,
  },
  {
    id: 3,
    name: "Study Group C",
    image:
      "https://img.freepik.com/free-photo/students-are-working-together_1098-17763.jpg",
    createdBy: 1,
    currentUserId: 1,
  },
];

const sidebarIcons: SidebarIcon[] = [
  {
    id: "meetings",
    name: "Upcoming Meetings",
    icon: <FaCalendarAlt size={20} />,
    route: "/meetings",
  },
  {
    id: "recordings",
    name: "Recordings",
    icon: <FaVideo size={20} />,
    route: "/recordings",
  },
];

const Sidebar: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [isJoinGroupModalOpen, setJoinGroupModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
  });
  const [groupMenu, setGroupMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 },
    group: null as Group | null,
  });
  const [isViewGroupDetailsModalOpen, setIsViewGroupDetailsModalOpen] = useState(false);
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);
  const [isLeaveGroupDialogOpen, setIsLeaveGroupDialogOpen] = useState(false);

  const navigate = useNavigate();

  const openContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ visible: true, position: { x: e.pageX, y: e.pageY } });
  };

  const closeContextMenu = () =>
    setContextMenu((prev) => ({ ...prev, visible: false }));

  const handleCreateGroup = () => setCreateGroupModalOpen(true);

  const handleJoinGroup = () => setJoinGroupModalOpen(true);

  const openGroupMenu = (e: React.MouseEvent, group: Group) => {
    e.preventDefault();
    setGroupMenu({ visible: true, position: { x: e.pageX, y: e.pageY }, group });
  };

  const closeGroupMenu = () =>
    setGroupMenu({ visible: false, group: null, position: { x: 0, y: 0 } });

  const navigateToGroupDetails = () => setIsViewGroupDetailsModalOpen(true);

  const closeViewGroupDetailsModal = () => {
    setIsViewGroupDetailsModalOpen(false);
  };

  const handleGroupAction = (action: string) => {
    if (!groupMenu.group) return;
    switch (action) {
      case "edit":
        console.log("Edit group:", groupMenu.group);
        break;
      case "delete":
        setIsDeleteGroupDialogOpen(true);
        break;
      case "createChannel":
        setIsChannelDialogOpen(true);
        break;
      case "leave":
        setIsLeaveGroupDialogOpen(true);
        break;
      default:
        break;
    }
    closeGroupMenu();
  };

  const handleIconClick = (route: string) => navigate(route);

  return (
    <div className="w-20 bg-dark1 h-full p-3 flex flex-col items-center overflow-hidden">
      <SidebarLogo onClick={() => setSelectedGroupId(null)} />
      <SidebarDivider />

      <SidebarGroup
        groups={groups}
        selectedGroupId={selectedGroupId}
        setSelectedGroupId={setSelectedGroupId}
        onGroupContextMenu={openGroupMenu}
      />

      <SidebarDivider />

      <AddGroupButton
        onClick={handleCreateGroup}
        onContextMenu={openContextMenu}
        title="Add a Group"
      />

      <ContextMenus
        contextMenu={contextMenu}
        closeContextMenu={closeContextMenu}
        handleCreateGroup={handleCreateGroup}
        handleJoinGroup={handleJoinGroup}
        groupMenu={groupMenu}
        closeGroupMenu={closeGroupMenu}
        handleGroupAction={handleGroupAction}
        navigateToGroupDetails={navigateToGroupDetails}
      />

      <SidebarDivider />

      {/* <SidebarActions icons={sidebarIcons} onIconClick={handleIconClick} /> */}

      <ModalsManager
        isJoinGroupModalOpen={isJoinGroupModalOpen}
        closeJoinGroupModal={() => setJoinGroupModalOpen(false)}
        isCreateGroupModalOpen={isCreateGroupModalOpen}
        closeCreateGroupModal={() => setCreateGroupModalOpen(false)}
        isViewGroupDetailsModalOpen={isViewGroupDetailsModalOpen}
        closeViewGroupDetailsModal={closeViewGroupDetailsModal}
      />

      {isChannelDialogOpen && (
        <CreateChannelDialog
          isOpen={isChannelDialogOpen}
          setIsOpen={setIsChannelDialogOpen}
        />
      )}
      {isDeleteGroupDialogOpen && (
        <DeleteGroupDialog
          isOpen={isDeleteGroupDialogOpen}
          setIsOpen={setIsDeleteGroupDialogOpen}
        />
      )}
      {isLeaveGroupDialogOpen && (
        <LeaveGroupDialog
          isOpen={isLeaveGroupDialogOpen}
          setIsOpen={setIsLeaveGroupDialogOpen}
        />
      )}
    </div>
  );
};

export default Sidebar;

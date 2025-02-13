// groupSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Member } from "../types";

export interface UserJoinedGroups {
  _id: string;
  name: string;
  description: string;
  members: Member[];
  avatar?: string;
  coverImage?: string;
  createdBy: string;
  createdAt: string;
  isJoinableExternally: boolean;
}

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export interface GroupContextMenu {
  isOpen: boolean;
  position: ContextMenuPosition;
  groupId: string | null;
}

export interface GroupState {
  selectedGroupId: string | null;
  contextMenu: GroupContextMenu;

  // For "View Group Details"
  viewGroupDetailsData: UserJoinedGroups | null;
  isViewGroupDetailsModalOpen: boolean;

  // For "Edit Group" dialog
  editGroupData: UserJoinedGroups | null;
  isEditGroupDialogOpen: boolean;

  // For "Delete Group" dialog
  deleteGroupData: UserJoinedGroups | null;
  isDeleteGroupDialogOpen: boolean;

  // For "Leave Group" dialog
  leaveGroupData: UserJoinedGroups | null;
  isLeaveGroupDialogOpen: boolean;
}

const initialState: GroupState = {
  selectedGroupId: null,
  contextMenu: {
    isOpen: false,
    position: { x: 0, y: 0 },
    groupId: null,
  },
  viewGroupDetailsData: null,
  isViewGroupDetailsModalOpen: false,

  editGroupData: null,
  isEditGroupDialogOpen: false,

  deleteGroupData: null,
  isDeleteGroupDialogOpen: false,

  leaveGroupData: null,
  isLeaveGroupDialogOpen: false,
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setSelectedGroupId: (state, action: PayloadAction<string | null>) => {
      state.selectedGroupId = action.payload;
    },

    openContextMenu: (
      state,
      action: PayloadAction<{ position: ContextMenuPosition; groupId: string }>
    ) => {
      state.contextMenu.isOpen = true;
      state.contextMenu.position = action.payload.position;
      state.contextMenu.groupId = action.payload.groupId;
    },
    closeContextMenu: (state) => {
      state.contextMenu.isOpen = false;
      state.contextMenu.groupId = null;
    },

    // View Group Details
    openViewGroupDetailsModal: (state, action: PayloadAction<UserJoinedGroups>) => {
      state.viewGroupDetailsData = action.payload;
      state.isViewGroupDetailsModalOpen = true;
    },
    closeViewGroupDetailsModal: (state) => {
      state.viewGroupDetailsData = null;
      state.isViewGroupDetailsModalOpen = false;
    },

    // ---- Edit Group
    openEditGroupDialog: (state, action: PayloadAction<UserJoinedGroups>) => {
      state.editGroupData = action.payload;
      state.isEditGroupDialogOpen = true;
    },
    closeEditGroupDialog: (state) => {
      state.editGroupData = null;
      state.isEditGroupDialogOpen = false;
    },

    // ---- Delete Group
    openDeleteGroupDialog: (state, action: PayloadAction<UserJoinedGroups>) => {
      state.deleteGroupData = action.payload;
      state.isDeleteGroupDialogOpen = true;
    },
    closeDeleteGroupDialog: (state) => {
      state.deleteGroupData = null;
      state.isDeleteGroupDialogOpen = false;
    },

    // ---- Leave Group
    openLeaveGroupDialog: (state, action: PayloadAction<UserJoinedGroups>) => {
      state.leaveGroupData = action.payload;
      state.isLeaveGroupDialogOpen = true;
    },
    closeLeaveGroupDialog: (state) => {
      state.leaveGroupData = null;
      state.isLeaveGroupDialogOpen = false;
    },
  },
});

export const {
  setSelectedGroupId,
  openContextMenu,
  closeContextMenu,
  openViewGroupDetailsModal,
  closeViewGroupDetailsModal,

  openEditGroupDialog,
  closeEditGroupDialog,
  openDeleteGroupDialog,
  closeDeleteGroupDialog,
  openLeaveGroupDialog,
  closeLeaveGroupDialog,
} = groupSlice.actions;


// Selectors
export const selectSelectedGroupId = (state: { group: GroupState }) =>
  state.group.selectedGroupId;

export const selectGroupContextMenu = (state: { group: GroupState }) =>
  state.group.contextMenu;

export const selectViewGroupDetailsData = (state: { group: GroupState }) =>
  state.group.viewGroupDetailsData;

export const selectIsViewGroupDetailsModalOpen = (state: { group: GroupState }) =>
  state.group.isViewGroupDetailsModalOpen;

// For Edit
export const selectIsEditGroupDialogOpen = (state: { group: GroupState }) =>
  state.group.isEditGroupDialogOpen;
export const selectEditGroupData = (state: { group: GroupState }) =>
  state.group.editGroupData;

// For Delete
export const selectIsDeleteGroupDialogOpen = (state: { group: GroupState }) =>
  state.group.isDeleteGroupDialogOpen;
export const selectDeleteGroupData = (state: { group: GroupState }) =>
  state.group.deleteGroupData;

// For Leave
export const selectIsLeaveGroupDialogOpen = (state: { group: GroupState }) =>
  state.group.isLeaveGroupDialogOpen;
export const selectLeaveGroupData = (state: { group: GroupState }) =>
  state.group.leaveGroupData;

export default groupSlice.reducer;

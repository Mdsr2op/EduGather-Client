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
  viewGroupDetailsData: UserJoinedGroups | null;
  isViewGroupDetailsModalOpen: boolean;
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

    openViewGroupDetailsModal: (state, action: PayloadAction<UserJoinedGroups>) => {
      state.viewGroupDetailsData = action.payload;
      state.isViewGroupDetailsModalOpen = true;
    },
    closeViewGroupDetailsModal: (state) => {
      state.viewGroupDetailsData = null;
      state.isViewGroupDetailsModalOpen = false;
    },
  },
});

export const {
  setSelectedGroupId,
  openContextMenu,
  closeContextMenu,
  openViewGroupDetailsModal,
  closeViewGroupDetailsModal,
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

export default groupSlice.reducer;

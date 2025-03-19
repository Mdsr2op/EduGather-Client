// channelSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Channel {
  _id: string;
  channelName: string;
  description: string;
  groupId?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface ChannelContextMenuPosition {
  x: number;
  y: number;
}

export interface ChannelContextMenu {
  isOpen: boolean;
  position: ChannelContextMenuPosition;
  channelId: string | null;
}

export interface ChannelState {
  selectedChannelId: string | null;
  contextMenu: ChannelContextMenu;

  // NEW: For "View Channel Details" dialog
  isViewChannelDetailsOpen: boolean;
  viewChannelDetailsData: Channel | null;

  // NEW: For "Edit Channel" dialog
  isEditChannelDialogOpen: boolean;
  editChannelData: Channel | null;

  // NEW: For "Delete Channel" dialog
  isDeleteChannelDialogOpen: boolean;
  deleteChannelData: Channel | null;
}

const initialState: ChannelState = {
  selectedChannelId: null,
  contextMenu: {
    isOpen: false,
    position: { x: 0, y: 0 },
    channelId: null,
  },

  // Additional
  isViewChannelDetailsOpen: false,
  viewChannelDetailsData: null,

  isEditChannelDialogOpen: false,
  editChannelData: null,

  isDeleteChannelDialogOpen: false,
  deleteChannelData: null,
};

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    // Existing
    setSelectedChannelId: (state, action: PayloadAction<string | null>) => {
      state.selectedChannelId = action.payload;
    },
    openChannelContextMenu: (
      state,
      action: PayloadAction<{
        position: ChannelContextMenuPosition;
        channelId: string;
      }>
    ) => {
      const { position, channelId } = action.payload;
      state.contextMenu.isOpen = true;
      state.contextMenu.position = position;
      state.contextMenu.channelId = channelId;
    },
    closeChannelContextMenu: (state) => {
      state.contextMenu.isOpen = false;
      state.contextMenu.channelId = null;
    },

    // NEW: View Channel
    openViewChannelDetailsDialog: (state, action: PayloadAction<Channel>) => {
      state.viewChannelDetailsData = action.payload;
      state.isViewChannelDetailsOpen = true;
    },
    closeViewChannelDetailsDialog: (state) => {
      state.viewChannelDetailsData = null;
      state.isViewChannelDetailsOpen = false;
    },

    // NEW: Edit Channel
    openEditChannelDialog: (state, action: PayloadAction<Channel>) => {
      state.editChannelData = action.payload;
      state.isEditChannelDialogOpen = true;
    },
    closeEditChannelDialog: (state) => {
      state.editChannelData = null;
      state.isEditChannelDialogOpen = false;
    },

    // NEW: Delete Channel
    openDeleteChannelDialog: (state, action: PayloadAction<Channel>) => {
      state.deleteChannelData = action.payload;
      state.isDeleteChannelDialogOpen = true;
    },
    closeDeleteChannelDialog: (state) => {
      state.deleteChannelData = null;
      state.isDeleteChannelDialogOpen = false;
    },
  },
});

export const {
  setSelectedChannelId,
  openChannelContextMenu,
  closeChannelContextMenu,
  openViewChannelDetailsDialog,
  closeViewChannelDetailsDialog,
  openEditChannelDialog,
  closeEditChannelDialog,
  openDeleteChannelDialog,
  closeDeleteChannelDialog,
} = channelSlice.actions;

// Selectors
export const selectSelectedChannelId = (state: { channel: ChannelState }) =>
  state.channel.selectedChannelId;

export const selectChannelContextMenu = (state: { channel: ChannelState }) =>
  state.channel.contextMenu;

// NEW selectors for the dialogs
export const selectIsViewChannelDetailsOpen = (state: { channel: ChannelState }) =>
  state.channel.isViewChannelDetailsOpen;
export const selectViewChannelDetailsData = (state: { channel: ChannelState }) =>
  state.channel.viewChannelDetailsData;

export const selectIsEditChannelDialogOpen = (state: { channel: ChannelState }) =>
  state.channel.isEditChannelDialogOpen;
export const selectEditChannelData = (state: { channel: ChannelState }) =>
  state.channel.editChannelData;

export const selectIsDeleteChannelDialogOpen = (state: { channel: ChannelState }) =>
  state.channel.isDeleteChannelDialogOpen;
export const selectDeleteChannelData = (state: { channel: ChannelState }) =>
  state.channel.deleteChannelData;

export default channelSlice.reducer;

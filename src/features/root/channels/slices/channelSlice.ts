import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define your Channel type
// This interface can mirror what you have in your Channel mongoose model
export interface Channel {
  _id: string;
  channelName: string;
  description: string;
  groupId?: string;
  createdBy?: string;
  createdAt?: string;
}

// For storing the context menu position
export interface ChannelContextMenuPosition {
  x: number;
  y: number;
}

export interface ChannelContextMenu {
  isOpen: boolean;
  position: ChannelContextMenuPosition;
  channelId: string | null;
}

// The shape of your channel slice
export interface ChannelState {
  selectedChannelId: string | null;
  contextMenu: ChannelContextMenu;
}

// Initial state
const initialState: ChannelState = {
  selectedChannelId: null,
  contextMenu: {
    isOpen: false,
    position: { x: 0, y: 0 },
    channelId: null,
  },
};

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
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
  },
});

export const {
  setSelectedChannelId,
  openChannelContextMenu,
  closeChannelContextMenu,
} = channelSlice.actions;

// Selectors
export const selectSelectedChannelId = (state: { channel: ChannelState }) =>
  state.channel.selectedChannelId;

export const selectChannelContextMenu = (state: { channel: ChannelState }) =>
  state.channel.contextMenu;

// Reducer
export default channelSlice.reducer;

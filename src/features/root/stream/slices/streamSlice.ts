import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store/store";

export interface StreamUser {
  id: string;
  name: string;
  username: string;
  image: string;
  email: string;
}

export interface StreamState {
  apiKey: string | null;
  token: string | null;
  user: StreamUser | null;
  isInitialized: boolean;
  activeCall: {
    callId: string | null;
    callType: 'video' | 'audio' | null;
    participants: string[];
  };
}

const initialState: StreamState = {
  apiKey: null,
  token: null,
  user: null,
  isInitialized: false,
  activeCall: {
    callId: null,
    callType: null,
    participants: [],
  },
};

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setStreamApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
    },
    setStreamToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setStreamUser: (state, action: PayloadAction<StreamUser>) => {
      state.user = action.payload;
    },
    setStreamInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setActiveCall: (state, action: PayloadAction<{ callId: string; callType: 'video' | 'audio'; participants: string[] }>) => {
      state.activeCall = action.payload;
    },
    clearActiveCall: (state) => {
      state.activeCall = {
        callId: null,
        callType: null,
        participants: [],
      };
    },
    resetStreamState: (state) => {
      state.apiKey = null;
      state.token = null;
      state.user = null;
      state.isInitialized = false;
      state.activeCall = {
        callId: null,
        callType: null,
        participants: [],
      };
    },
  },
});

export const {
  setStreamApiKey,
  setStreamToken,
  setStreamUser,
  setStreamInitialized,
  setActiveCall,
  clearActiveCall,
  resetStreamState,
} = streamSlice.actions;

// Selectors
export const selectStreamApiKey = (state: RootState) => state.stream?.apiKey;
export const selectStreamToken = (state: RootState) => state.stream?.token;
export const selectStreamUser = (state: RootState) => state.stream?.user;
export const selectStreamInitialized = (state: RootState) => state.stream?.isInitialized;
export const selectActiveCall = (state: RootState) => state.stream?.activeCall;

export default streamSlice.reducer;

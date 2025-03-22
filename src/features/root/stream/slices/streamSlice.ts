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
}

const initialState: StreamState = {
  apiKey: null,
  token: null,
  user: null,
  isInitialized: false,
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
    resetStreamState: (state) => {
      state.apiKey = null;
      state.token = null;
      state.user = null;
      state.isInitialized = false;
    },
  },
});

export const {
  setStreamApiKey,
  setStreamToken,
  setStreamUser,
  setStreamInitialized,
  resetStreamState,
} = streamSlice.actions;

// Selectors
export const selectStreamApiKey = (state: RootState) => state.stream?.apiKey;
export const selectStreamToken = (state: RootState) => state.stream?.token;
export const selectStreamUser = (state: RootState) => state.stream?.user;
export const selectStreamInitialized = (state: RootState) => state.stream?.isInitialized;

export default streamSlice.reducer;

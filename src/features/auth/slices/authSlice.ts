// src/features/auth/slices/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

export interface AuthState {
  user: User | null;
  token: string | null;
}

const userKey = 'user';
const tokenKey = 'token';

const getParsedItem = (key: string): any => {
  const item = localStorage.getItem(key);
  if (item && item !== 'undefined') {
    try {
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error parsing JSON from localStorage key "${key}":`, error);
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  user: getParsedItem(userKey),
  token: localStorage.getItem(tokenKey) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      localStorage.setItem(tokenKey, accessToken);
      localStorage.setItem(userKey, JSON.stringify(user));
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;

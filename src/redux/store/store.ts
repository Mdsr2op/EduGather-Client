// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import authReducer from "../../features/auth/slices/authSlice";
import groupReducer from "../../features/root/groups/slices/groupSlice";
import channelReducer from "../../features/root/channels/slices/channelSlice";
import streamReducer from "../../features/root/stream/slices/streamSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    group: groupReducer,
    channel: channelReducer,
    stream: streamReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

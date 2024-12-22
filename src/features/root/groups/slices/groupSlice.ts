// groupSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserJoinedGroups {
  _id: string;                  
  name: string;                 
  description: string;          
  avatar?: string;              
  coverImage?: string;          
  createdBy: string;            
  createdAt: string;            
  isJoinableExternally: boolean;
}

export interface GroupState {
  selectedGroupId: string | null;
}

const initialState: GroupState = {
  selectedGroupId: null,
};

export const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setSelectedGroupId: (state, action: PayloadAction<string | null>) => {
      state.selectedGroupId = action.payload;
    },
  },
});

export const { setSelectedGroupId } = groupSlice.actions;

// A selector to get the selectedGroupId from the store
export const selectSelectedGroupId = (state: GroupState) =>
  state.selectedGroupId;

export default groupSlice.reducer;

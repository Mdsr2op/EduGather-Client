import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from './messagesApiSlice';

interface ReplyTo {
  messageId: string;
  content: string;
  senderId: {
    _id: string;
    username: string;
  };
}

interface MessagesState {
  currentChannelId: string | null;
  messages: Message[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  replyTo: ReplyTo | null;
  pinnedMessage: Message | null;
}

const initialState: MessagesState = {
  currentChannelId: null,
  messages: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  replyTo: null,
  pinnedMessage: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setCurrentChannel: (state, action: PayloadAction<string>) => {
      state.currentChannelId = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const index = state.messages.findIndex(msg => msg._id === action.payload._id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    updatePagination: (state, action: PayloadAction<MessagesState['pagination']>) => {
      state.pagination = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setReplyTo: (state, action: PayloadAction<ReplyTo | null>) => {
      state.replyTo = action.payload;
    },
    setPinnedMessage: (state, action: PayloadAction<Message | null>) => {
      state.pinnedMessage = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.pagination = initialState.pagination;
      state.replyTo = null;
      state.pinnedMessage = null;
    },
  },
});

export const {
  setCurrentChannel,
  setMessages,
  addMessage,
  updateMessage,
  updatePagination,
  setLoading,
  setError,
  setReplyTo,
  setPinnedMessage,
  clearMessages,
} = messagesSlice.actions;

export default messagesSlice.reducer; 
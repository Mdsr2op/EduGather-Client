import { apiSlice } from "@/redux/api/apiSlice";

export interface Message {
  _id: string;
  channelId: string;
  senderId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  replyTo?: {
    messageId: string;
    content: string;
    senderId: string;
    senderName?: string;
  };
  forwardedFrom?: {
    messageId: string;
    channelId: string;
    senderId: string;
  };
  content: string;
  mentions?: string[];
  attachment?: {
    _id: string;
    url: string;
    fileType: string;
    fileName: string;
    size: number;
    type?: 'file' | 'image' | 'video' | 'meeting';
    meetingData?: {
      meetingId: string;
      title: string;
      startTime: string;
      endTime?: string;
      status: 'scheduled' | 'ongoing' | 'ended';
      participantsCount?: number;
    };
  };
  pinned: boolean;
  pinnedBy?: string;
  pinnedAt?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  timestamp?: number;
}

interface MessagesResponse {
  messages: Message[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface SendMessageRequest {
  channelId: string;
  senderId: string;
  replyTo?: string;
  content: string;
  mentions?: string[];
  attachment?: string;
}

interface EditMessageRequest {
  content: string;
  mentions?: string[];
}

interface ForwardMessageRequest {
  targetChannelId: string;
  senderId: string;
}

interface ReplyMessageRequest {
  channelId: string;
  senderId: string;
  content: string;
  mentions?: string[];
  attachment?: string;
}

interface PinnedMessagesResponse {
  success: boolean;
  data: PinnedMessage[];
}

interface PinnedMessage { 
    _id: string;
    channelId: string;
    senderId: {
      _id: string;
      username: string;
      avatar: string;
    };
    content: string;
    mentions: string[];
    replyTo: string | null;
    forwardedFrom: {
      messageId: string | null;
      channelId: string | null;
      senderId: string | null;
    };
    pinned: boolean;
    pinnedBy: {
      _id: string;
      username: string;
      avatar: string;
    };
    deletedAt: string | null;
    attachment: string | null;
    createdAt: string;
    updatedAt: string;
  }

// Search messages response type
interface SearchMessagesResponse {
  messages: Message[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Search messages request params
interface SearchMessagesParams {
  channelId: string;
  query: string;
  page?: number;
  limit?: number;
}

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all messages for a channel
    getMessages: builder.query<MessagesResponse, { channelId: string; page?: number; limit?: number }>({
      query: ({ channelId, page = 1, limit = 20 }) => ({
        url: `/messages/${channelId}?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: (_, __, { channelId }) => [
        { type: 'Messages', id: channelId },
      ],
    }),
    
    // Send a new message
    sendMessage: builder.mutation<Message, SendMessageRequest>({
      query: ({ channelId, ...messageData }) => ({
        url: `/messages/${channelId}`,
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: (_, __, { channelId }) => [
        { type: 'Messages', id: channelId },
      ],
    }),
    
    // Edit a message
    editMessage: builder.mutation<Message, { messageId: string; data: EditMessageRequest }>({
      query: ({ messageId, data }) => ({
        url: `/messages/${messageId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result) => [
        { type: 'Messages', id: result?.channelId },
      ],
    }),
    
    // Delete a message (soft delete)
    deleteMessage: builder.mutation<Message, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `/messages/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result) => [
        { type: 'Messages', id: result?.channelId },
      ],
    }),
    
    // Pin a message
    pinMessage: builder.mutation<Message, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `/messages/${messageId}/pin`,
        method: 'POST',
      }),
      invalidatesTags: (result) => [
        { type: 'Messages', id: result?.channelId },
      ],
    }),
    
    // Unpin a message
    unpinMessage: builder.mutation<Message, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `/messages/${messageId}/pin`,
        method: 'DELETE',
      }),
      invalidatesTags: (result) => [
        { type: 'Messages', id: result?.channelId },
      ],
    }),
    
    // Get pinned messages for a channel
    getPinnedMessages: builder.query<PinnedMessagesResponse, { channelId: string }>({
      query: ({ channelId }) => ({
        url: `/messages/${channelId}/pinned`,
        method: 'GET',
      }),
      providesTags: (_, __, { channelId }) => [
        { type: 'Messages', id: `${channelId}-pinned` },
      ],
    }),
    
    // Forward a message to another channel
    forwardMessage: builder.mutation<Message, { messageId: string; data: ForwardMessageRequest }>({
      query: ({ messageId, data }) => ({
        url: `/messages/${messageId}/forward`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result) => [
        { type: 'Messages', id: result?.channelId },
      ],
    }),
    
    // Reply to a message
    replyMessage: builder.mutation<Message, { messageId: string; data: ReplyMessageRequest }>({
      query: ({ messageId, data }) => ({
        url: `/messages/${messageId}/reply`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result) => [
        { type: 'Messages', id: result?.channelId },
      ],
    }),
    
    // Search messages in a channel
    searchMessages: builder.query<SearchMessagesResponse, SearchMessagesParams>({
      query: ({ channelId, query, page = 1, limit = 20 }) => ({
        url: `/messages/${channelId}/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: (_, __, { channelId, query }) => [
        { type: 'Messages', id: `${channelId}-search-${query}` },
      ],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  usePinMessageMutation,
  useUnpinMessageMutation,
  useGetPinnedMessagesQuery,
  useForwardMessageMutation,
  useReplyMessageMutation,
  useSearchMessagesQuery,
} = messagesApiSlice; 
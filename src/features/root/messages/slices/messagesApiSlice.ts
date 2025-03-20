import { apiSlice } from "@/redux/api/apiSlice";

export interface Message {
  _id: string;
  channelId: string;
  senderId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  replyTo?: string;
  content: string;
  mentions?: string[];
  pinned: boolean;
  pinnedBy?: string;
  createdAt: string;
  updatedAt: string;
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
}

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<MessagesResponse, { channelId: string; page?: number; limit?: number }>({
      query: ({ channelId, page = 1, limit = 20 }) => ({
        url: `/messages/${channelId}?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: (result, error, { channelId }) => [
        { type: 'Messages', id: channelId },
      ],
    }),
    sendMessage: builder.mutation<Message, SendMessageRequest>({
      query: ({ channelId, ...messageData }) => ({
        url: `/send-message/${channelId}`,
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: (result, error, { channelId }) => [
        { type: 'Messages', id: channelId },
      ],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
} = messagesApiSlice; 
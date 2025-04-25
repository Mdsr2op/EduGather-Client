import { apiSlice } from '@/redux/api/apiSlice';
import { Message } from '../../messages/slices/messagesApiSlice';

export interface Attachment {
  _id: string;
  url: string;
  publicId: string;
  fileType: string;
  fileName: string;
  size: number;
  messageId: string;
  channelId: string;
  uploadedBy: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AttachmentResponse {
  success: boolean;
  message: string;
  data: {
    message: Message;
    attachments: Attachment[];
  };
}

export interface DeleteAttachmentResponse {
  success: boolean;
  message: string;
}

export interface GetChannelAttachmentsResponse {
  success: boolean;
  message: string;
  data: {
    messages: Message[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const attachmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadAttachment: builder.mutation<AttachmentResponse, { channelId: string; formData: FormData }>({
      query: ({ channelId, formData }) => ({
        url: `/attachments/${channelId}`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (_, __, { channelId }) => [
        { type: 'Messages', id: channelId }
      ]
    }),
    deleteAttachment: builder.mutation<DeleteAttachmentResponse, string>({
      query: (attachmentId) => ({
        url: `/attachments/delete/${attachmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Messages']
    }),
    getChannelAttachments: builder.query<GetChannelAttachmentsResponse, { channelId: string; page?: number; limit?: number }>({
      query: ({ channelId, page = 1, limit = 20 }) => ({
        url: `/attachments/${channelId}?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: (_, __, { channelId }) => [
        { type: 'Messages', id: channelId }
      ]
    }),
  }),
});

export const {
  useGetChannelAttachmentsQuery,
  useUploadAttachmentMutation,
  useDeleteAttachmentMutation
} = attachmentsApiSlice; 
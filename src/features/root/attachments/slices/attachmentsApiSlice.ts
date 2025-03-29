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

export const attachmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadAttachment: builder.mutation<AttachmentResponse, { channelId: string; formData: FormData }>({
      query: ({ channelId, formData }) => ({
        url: `/attachments/${channelId}`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { channelId }) => [
        { type: 'Messages', id: channelId }
      ]
    }),
  }),
});

export const {
  useUploadAttachmentMutation
} = attachmentsApiSlice; 
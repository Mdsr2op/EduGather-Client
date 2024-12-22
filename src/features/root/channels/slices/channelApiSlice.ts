import { apiSlice } from "@/redux/api/apiSlice";
import { Channel } from "./channelSlice";

interface GetAllChannelsResponse {
    data: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        channels: Channel[];
    }

}

export const channelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query<GetAllChannelsResponse, string>({
      query: (groupId: string) => ({
        url: `/study-groups/${groupId}/channels`,
        method: "GET",
      }),
    }),

    createChannel: builder.mutation<Channel, { groupId: string; channelName: string; description?: string }>({
      query: ({ groupId, channelName, description }) => ({
        url: `/study-groups/${groupId}/channels`,
        method: "POST",
        body: { channelName, description },
      }),
    }),

    updateChannel: builder.mutation<Channel,{ groupId: string; channelId: string; channelName?: string; description?: string }>({
      query: ({ groupId, channelId, channelName, description }) => ({
        url: `/study-groups/${groupId}/channels/${channelId}`,
        method: "PUT",
        body: { channelName, description },
      }),
    }),

    deleteChannel: builder.mutation<null, { groupId: string; channelId: string }>({
      query: ({ groupId, channelId }) => ({
        url: `/study-groups/${groupId}/channels/${channelId}`,
        method: "DELETE",
      }),
    }),

    getChannelDetails: builder.query<Channel, { groupId: string; channelId: string }>({
      query: ({ groupId, channelId }) => ({
        url: `/study-groups/${groupId}/channels/${channelId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useDeleteChannelMutation,
  useGetChannelDetailsQuery,
} = channelApiSlice;

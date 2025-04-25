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

interface GetChannelDetailsResponse {
    data: Channel;
}

export const channelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChannels: builder.query<GetAllChannelsResponse, string>({
      query: (groupId: string) => ({
        url: `/study-groups/${groupId}/channels`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.channels.map(({ _id }) => ({ type: 'Channels' as const, id: _id })),
              { type: 'Channels', id: 'LIST' },
            ]
          : [{ type: 'Channels', id: 'LIST' }],
    }),

    createChannel: builder.mutation<Channel, { groupId: string | null; channelName: string; description?: string }>({
      query: ({ groupId, channelName, description }) => ({
        url: `/study-groups/${groupId}/channels`,
        method: "POST",
        body: { channelName, description },
      }),
      invalidatesTags: [{ type: 'Channels', id: 'LIST' }]
    }),

    updateChannel: builder.mutation<Channel,{ groupId: string | null; channelId: string; channelName?: string; description?: string }>({
      query: ({ groupId, channelId, channelName, description }) => ({
        url: `/study-groups/${groupId}/channels/${channelId}`,
        method: "PUT",
        body: { channelName, description },
      }),
      invalidatesTags: (_, __, arg) => [
        { type: 'Channels', id: arg.channelId },
        { type: 'Channels', id: 'LIST' }
      ]
    }),

    deleteChannel: builder.mutation<null, { groupId: string | null; channelId: string }>({
      query: ({ groupId, channelId }) => ({
        url: `/study-groups/${groupId}/channels/${channelId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, arg) => [
        { type: 'Channels', id: arg.channelId },
        { type: 'Channels', id: 'LIST' }
      ]
    }),

    getChannelDetails: builder.query<GetChannelDetailsResponse, { groupId: string | null; channelId: string }>({
      query: ({ groupId, channelId }) => ({
        url: `/study-groups/${groupId}/channels/${channelId}`,
        method: "GET",
      }),
      providesTags: (result) => 
        result ? [{ type: 'Channels' as const, id: result.data._id }] : [],
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

// groupApiSlice.ts

import { apiSlice } from "@/redux/api/apiSlice";
import { UserJoinedGroups } from "./groupSlice";
import { Member } from "../types";

interface GetJoinedGroupsResponse {
  groups: {
    _id: string;
    name: string;
    members: Member[];
    description: string;
    avatar?: string;
    coverImage?: string;
    createdBy: string;
    createdAt: string;
    isJoinableExternally: boolean;
  }[];
}

export const groupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJoinedGroups: builder.query<UserJoinedGroups[], string>({
      query: (userId) => `/users/get-joined-groups/${userId}`,
      transformResponse: (response: GetJoinedGroupsResponse) => {
        return response.groups.map((group) => ({
          _id: group._id,
          name: group.name,
          description: group.description,
          avatar: group.avatar,
          members: group.members,
          coverImage: group.coverImage,
          createdBy: group.createdBy,
          createdAt: group.createdAt,
          isJoinableExternally: group.isJoinableExternally,
        }));
      },
      // Provide a tag for the entire list of groups
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map((group) => ({ type: "Groups" as const, id: group._id })),
              { type: "Groups", id: "LIST" },
            ]
          : [{ type: "Groups", id: "LIST" }],
    }),

    // 1) Create a new group
    createGroup: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `/study-groups`,
        method: "POST",
        body: formData,
      }),
      // Invalidate the LIST tag so getJoinedGroups re-fetches
      invalidatesTags: [{ type: "Groups", id: "LIST" }],
    }),

    // 2) Update a group
    updateGroup: builder.mutation<any, { groupId: string; formData: FormData }>({
      query: ({ groupId, formData }) => ({
        url: `/study-groups/${groupId}`,
        method: "PUT",
        body: formData,
      }),
      // Potentially also invalidate the single group tag or the list
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Groups", id: groupId },
        { type: "Groups", id: "LIST" },
      ],
    }),

    // 3) Delete a group
    deleteGroup: builder.mutation<any, string>({
      query: (groupId) => ({
        url: `/study-groups/${groupId}`,
        method: "DELETE",
      }),
      // Also invalidate so the list re-fetches
      invalidatesTags: (result, error, groupId) => [
        { type: "Groups", id: groupId },
        { type: "Groups", id: "LIST" },
      ],
    }),

    // 4) Join a group
    joinGroup: builder.mutation<any, { groupId: string }>({
      query: ({ groupId }) => ({
        url: `/study-groups/${groupId}/join`,
        method: "POST",
      }),
      // If user joins, the list changes
      invalidatesTags: [{ type: "Groups", id: "LIST" }],
    }),

    // 5) Leave a group
    leaveGroup: builder.mutation<any, { groupId: string }>({
      query: ({ groupId }) => ({
        url: `/study-groups/${groupId}/leave`,
        method: "POST",
      }),
      // If user leaves, the list changes
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Groups", id: groupId },
        { type: "Groups", id: "LIST" },
      ],
    }),
  }),
  // By default, `apiSlice` might not have "Groups" in tagTypes. Add it there:
  overrideExisting: false,
});

// Export the hooks
export const {
  useGetJoinedGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
} = groupApiSlice;

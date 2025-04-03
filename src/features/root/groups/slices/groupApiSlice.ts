// src/features/groups/slices/groupApiSlice.ts
import { apiSlice } from "@/redux/api/apiSlice";
import { UserJoinedGroups } from "./groupSlice"; // Ensure GroupDetails is imported correctly
import { GetAllGroupsResponse, GetGroupDetailsResponse, GetJoinedGroupsResponse, Member } from "../types";

export const groupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJoinedGroups: builder.query<UserJoinedGroups[], string>({
      query: (userId) => `/users/get-joined-groups/${userId}`,
      transformResponse: (response: GetJoinedGroupsResponse) =>
        response.groups.map((group) => ({
          _id: group._id,
          name: group.name,
          description: group.description,
          avatar: group.avatar,
          members: group.members,
          coverImage: group.coverImage,
          createdBy: group.createdBy,
          createdAt: group.createdAt,
          isJoinableExternally: group.isJoinableExternally,
        })),
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map((group) => ({ type: "Groups" as const, id: group._id })),
              { type: "Groups", id: "LIST" },
            ]
          : [{ type: "Groups", id: "LIST" }],
    }),

    createGroup: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `/study-groups`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Groups", id: "LIST" }],
    }),

    getAllGroups: builder.query<UserJoinedGroups[], void>({
      query: () => `/study-groups`,
      transformResponse: (response: GetAllGroupsResponse) =>
        response.data.groups.map((group) => ({
          _id: group._id,
          name: group.name,
          description: group.description,
          avatar: group.avatar,
          coverImage: group.coverImage,
          createdBy: group.createdBy,
          createdAt: group.createdAt,
          isJoinableExternally: group.isJoinableExternally,
          members: group.members,
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Groups" as const, id: _id })),
              { type: "Groups", id: "LIST" },
            ]
          : [{ type: "Groups", id: "LIST" }],
    }),

    getGroupsByCategory: builder.query<UserJoinedGroups[], { category: string; page?: number; limit?: number }>({
      query: ({ category, page = 1, limit = 10 }) => 
        `/study-groups/category?category=${category}&page=${page}&limit=${limit}`,
      transformResponse: (response: { data: { groups: any[]; totalItems: number; totalPages: number; currentPage: number; hasNextPage: boolean }; message: string; status: number }) =>
        response.data.groups.map((group) => ({
          _id: group._id,
          name: group.name,
          description: group.description,
          avatar: group.avatar,
          coverImage: group.coverImage,
          createdBy: group.createdBy,
          createdAt: group.createdAt,
          isJoinableExternally: group.isJoinableExternally,
          members: group.members,
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Groups" as const, id: _id })),
              { type: "Groups", id: "LIST" },
            ]
          : [{ type: "Groups", id: "LIST" }],
    }),

    updateGroup: builder.mutation<any, { groupId: string; formData: FormData }>({
      query: ({ groupId, formData }) => ({
        url: `/study-groups/${groupId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Groups", id: groupId },
        { type: "Groups", id: "LIST" },
      ],
    }),

    deleteGroup: builder.mutation<any, string>({
      query: (groupId) => ({
        url: `/study-groups/${groupId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, groupId) => [
        { type: "Groups", id: groupId },
        { type: "Groups", id: "LIST" },
      ],
    }),

    joinGroup: builder.mutation<any, { groupId: string }>({
      query: ({ groupId }) => ({
        url: `/study-groups/${groupId}/join`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Groups", id: "LIST" }],
    }),

    leaveGroup: builder.mutation<any, { groupId: string }>({
      query: ({ groupId }) => ({
        url: `/study-groups/${groupId}/leave`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "Groups", id: groupId },
        { type: "Groups", id: "LIST" },
      ],
    }),

    // New endpoint for fetching group details
    getGroupDetails: builder.query<GetGroupDetailsResponse, string>({
      query: (groupId) => `/study-groups/${groupId}`,
      transformResponse: (response: { data: GetGroupDetailsResponse; message: string; status: number }) =>
        response.data,
      providesTags: (result, error, groupId) => [{ type: "Groups", id: groupId }],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in functional components
export const {
  useGetJoinedGroupsQuery,
  useGetAllGroupsQuery,
  useGetGroupsByCategoryQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useGetGroupDetailsQuery, // Newly added hook
} = groupApiSlice;

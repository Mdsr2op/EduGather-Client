// groupApiSlice.ts
import { apiSlice } from "@/redux/api/apiSlice";
import { UserJoinedGroups } from "./groupSlice";

interface GetJoinedGroupsResponse {
  groups: {
    _id: string;
    name: string;
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
          coverImage: group.coverImage,
          createdBy: group.createdBy,
          createdAt: group.createdAt,
          isJoinableExternally: group.isJoinableExternally,
        }));
      },
    }),
  }),
});

export const { useGetJoinedGroupsQuery } = groupApiSlice;

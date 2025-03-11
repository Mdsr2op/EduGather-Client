import { User } from "@/features/auth/types";

export interface Member {
  _id: string;
  role: "admin" | "member" | "moderator";
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  joinedAt: string;
}

export interface MembersResponse {
  members: Member[];
}

export interface GetJoinedGroupsResponse {
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

export interface GetAllGroupsResponse {
  status: number;
  data: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    groups: {
      _id: string;
      name: string;
      description: string;
      avatar?: string;
      coverImage?: string;
      createdBy: string;
      createdAt: string;
      isJoinableExternally: boolean;
      members: Member[];
    }[];
  };
  message: string;
}

export interface GetGroupDetailsResponse {
  _id: string;
  name: string;
  description: string;
  members: Member[];
  avatar?: string;
  coverImage?: string;
  createdBy: User;
  createdAt: string;
  isJoinableExternally: boolean;
}

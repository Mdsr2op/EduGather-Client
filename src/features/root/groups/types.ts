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

export interface CreatedBy {
  _id: string;
  username: string;
  fullName: string;
  avatar: string;
}

export interface GetJoinedGroupsResponse {
  groups: {
    _id: string;
    name: string;
    members: Member[];
    description: string;
    avatar?: string;
    coverImage?: string;
    createdBy: CreatedBy;
    createdAt: string;
    isJoinableExternally: boolean;
    category?: string[];
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
      createdBy: CreatedBy;
      createdAt: string;
      isJoinableExternally: boolean;
      members: Member[];
      category?: string[];
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
  category?: string[];
}

export interface Member {
    _id: string;
    groupId: string;
    role: "admin" | "member" | "moderator"; // Add other roles if applicable
    userId: {
      _id: string;
      username: string;
      email: string;
      fullName: string;
      avatar: string;
    };
    joinedAt: string; 
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
  export interface MembersResponse {
    members: Member[];
  }
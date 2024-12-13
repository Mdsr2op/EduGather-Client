// types.ts
export interface SignUpFormValues {
  username: string;
  email: string;
  fullname: string;
  avatar: File | null;
  coverImage: File | null;
  password: string;
}

// Types for SignIn
export interface SignInFormValues {
  usernameOrEmail: string;
  password: string;
}

// User type based on your backend
export interface User {
  id: string;
  username: string;
  email: string;
  fullname: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  // Add other user fields as needed
}

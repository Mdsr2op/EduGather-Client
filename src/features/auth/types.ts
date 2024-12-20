// Example types from your project references
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  coverImageUrl?: string;
}

export interface SignUpFormValues {
  username: string;
  email: string;
  fullname: string;
  avatar?: File | null;
  coverImage?: File | null;
  password: string;
}

export interface SignInFormValues {
  usernameOrEmail: string;
  password: string;
}

// The auth response from the backend
export interface AuthResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken:string
  }
}

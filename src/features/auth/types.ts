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
  
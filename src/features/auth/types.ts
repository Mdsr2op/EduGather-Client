export interface SignUpFormValues {
    username: string;
    email: string;
    fullname: string;
    avatar?: string;
    coverImage?: string;
    password: string;
  }
  
  // Types for SignIn
  export interface SignInFormValues {
    usernameOrEmail: string;
    password: string;
  }
  
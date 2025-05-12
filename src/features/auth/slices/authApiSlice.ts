import { apiSlice } from "@/redux/api/apiSlice";
import { setUser, setAccessToken, logOut } from "./authSlice";
import { AuthResponse, SignInFormValues, ForgotPasswordFormValues } from "../types";
import { toast } from "react-hot-toast";

// The backend's response has { data: { user, accessToken, refreshToken } } in some form
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthResponse, SignInFormValues>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          dispatch(setUser(result.data.user));
          dispatch(setAccessToken(result.data.accessToken));
        } catch (err) {
          console.error("Login error:", err);
        }
      },
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
        } catch (err) {
          console.error("Logout error:", err);
        }
      },
    }),
    signup: builder.mutation<AuthResponse, FormData>({
      query: (formData) => ({
        url: "/users/register",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          dispatch(setUser(result.data.user));
        } catch (err) {
          console.error("Signup error:", err);
        }
      },
    }),
    updateProfile: builder.mutation<AuthResponse, FormData>({
      query: (formData) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body: formData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          dispatch(setUser(result.data.user));
          toast.success("Profile updated successfully!");
        } catch (err) {
          console.error("Profile update error:", err);
          toast.error("Failed to update profile. Please try again.");
        }
      },
    }),
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordFormValues>({
      query: (data) => ({
        url: "/users/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    getCurrentUser: builder.query<any, void>({
      query: () => "/users/current-user",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // data should look like: { status: 200, data: userObject, message: "..." }
          dispatch(setUser(data.data));
        } catch (err) {
          // if 401 or an error, you can optionally dispatch setUser(null) or handle
          console.error("getCurrentUser error:", err);
          dispatch(setUser(null));
        }
      },
    }),
    // No need for a google auth endpoint since redirect is handled by the backend
    // We just need to check for auth errors after Google redirect
    checkGoogleAuthStatus: builder.query<any, void>({
      query: () => "/users/current-user",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data));
        } catch (err) {
          console.error("Google auth verification error:", err);
        }
      },
    }),
  }),
});

export const { 
  useSignInMutation, 
  useSignupMutation, 
  useGetCurrentUserQuery,
  useCheckGoogleAuthStatusQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useUpdateProfileMutation
} = authApiSlice;
  
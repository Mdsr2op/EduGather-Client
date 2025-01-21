import { apiSlice } from "@/redux/api/apiSlice";
import { setUser } from "./authSlice";
import { AuthResponse, SignInFormValues } from "../types";

// The backend’s response has { data: { user, accessToken, refreshToken } } in some form
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<AuthResponse, SignInFormValues>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          // We only store user in Redux
          dispatch(setUser(result.data.user));
        } catch (err) {
          console.error("Login error:", err);
        }
      },
    }),
    signup: builder.mutation<AuthResponse, FormData>({
      query: (formData) => ({
        url: "/users/register",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: result } = await queryFulfilled;
          dispatch(setUser(result.data.user));
        } catch (err) {
          console.error("Signup error:", err);
        }
      },
    }),
    getCurrentUser: builder.query<any, void>({
      query: () => "/users/current-user",
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
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
  }),
});

export const { useSignInMutation, useSignupMutation, useGetCurrentUserQuery } = authApiSlice;
  
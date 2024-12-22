import { apiSlice } from "@/redux/api/apiSlice";
import { setCredentials } from "./authSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AuthResponse, SignInFormValues } from "../types";



// The `SignUpFormValues` should be turned into `FormData` before calling this mutation.
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
          console.log(result)
          dispatch(setCredentials({ user: result.data.user, accessToken: result.data.accessToken }));
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
          dispatch(setCredentials({ user: result.data.user, accessToken: result.data.accessToken }));
        } catch (err) {
          console.error("Signup error:", err);
        }
      },
    }),
  }),
});

export const { useSignInMutation, useSignupMutation } = authApiSlice;

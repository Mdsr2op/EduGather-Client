import { apiSlice } from "@/redux/api/apiSlice";
import { setCredentials } from "./authSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { AuthResponse } from "../types";

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

// We'll use FormData for signup, as you're uploading files
// The `SignUpFormValues` should be turned into `FormData` before calling this mutation.
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
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
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
        } catch (err) {
          console.error("Signup error:", err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApiSlice;
